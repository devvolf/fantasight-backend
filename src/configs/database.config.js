import * as dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
mongoose.Promise = global.Promise;
import { GridFsStorage } from "multer-gridfs-storage";

const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const dbName = process.env.DB_NAME;
const databaseUrl = `mongodb://${user}:${password}@${host}:${port}/${dbName}?authSource=${dbName}`;
const imagesBucketName = "images";
const videosBucketName = "videos";

let imagesStorageStream;
let videosStorageStream;

const imagesStorage = new GridFsStorage({
  url: databaseUrl,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const match = ["image/png", "image/jpeg"];

    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${Date.now()}-${file.originalname}`;
      return filename;
    }

    return {
      bucketName: imagesBucketName,
      filename: `${Date.now()}-${file.originalname}`,
    };
  },
});

const videosStorage = new GridFsStorage({
  url: databaseUrl,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const match = ["video/mp4", "video/avi"];

    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${Date.now()}-${file.originalname}`;
      return filename;
    }

    return {
      bucketName: videosBucketName,
      filename: `${Date.now()}-${file.originalname}`,
    };
  },
});

const connectToDatabase = async () => {
  try {
    const connection = mongoose.createConnection(databaseUrl);

    connection.once("open", () => {
      imagesStorageStream = new mongoose.mongo.GridFSBucket(connection.db, {
        bucketName: imagesBucketName,
      });
      videosStorageStream = new mongoose.mongo.GridFSBucket(connection.db, {
        bucketName: videosBucketName,
      });
    });

    const promise = mongoose.connect(databaseUrl, {
      serverSelectionTimeoutMS: 5000,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to database");
  } catch (err) {
    console.error(err);
  }
};

const getImagesStorageStream = () => {
  return imagesStorageStream;
};

const getVideosStorageStream = () => {
  return videosStorageStream;
};

export default {
  databaseUrl,
  connectToDatabase,
  imagesBucketName,
  imagesStorage,
  getImagesStorageStream,
  videosBucketName,
  videosStorage,
  getVideosStorageStream,
};
