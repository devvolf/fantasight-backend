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
// const imagesBucketName = "images";
// let imagesStorage;

const connectToDatabase = async () => {
  try {
    const promise = mongoose.connect(databaseUrl, {
      serverSelectionTimeoutMS: 5000,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // const conn = mongoose.connection;

    // conn.once("open", () => {
    //   console.log("chuj");
    //   globalThis.imagesStorage = new GridFsStorage({
    //     url: promise,
    //     options: { useNewUrlParser: true, useUnifiedTopology: true },
    //     file: (req, file) => {
    //       const match = ["image/png", "image/jpeg"];

    //       if (match.indexOf(file.mimetype) === -1) {
    //         const filename = `${Date.now()}-bezkoder-${file.originalname}`;
    //         return filename;
    //       }

    //       return {
    //         bucketName: imagesBucketName,
    //         filename: `${Date.now()}-bezkoder-${file.originalname}`,
    //       };
    //     },
    //   });

    //   console.log(globalThis.imagesStorage);
    // });

    console.log("Connected to database");
  } catch (err) {
    console.error(err);
  }
};

export default {
  databaseUrl,
  connectToDatabase,
};
