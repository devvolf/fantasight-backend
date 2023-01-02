import dbConfig from "../configs/database.config.js";
import { Types } from "mongoose";

export default {
  uploadImages: async (req, res, next) => {
    try {
      console.log(req.files);
    } catch (err) {
      console.error(err);
      return;
    }

    res.status(200).send(req.files);
  },
  getImage: async (req, res, next) => {
    const imageId = req.params.id;

    const imagesStorageStream = dbConfig.getImagesStorageStream();

    imagesStorageStream
      .find({ _id: new Types.ObjectId(imageId) })
      .toArray(function (err, files) {
        const file = files[0];

        // Check if file
        if (!file || file.length === 0) {
          return res.status(404).json({
            message: "No file exists",
          });
        }

        // Check if image
        if (
          file.contentType === "image/jpeg" ||
          file.contentType === "image/png"
        ) {
          // Read output to browser
          var readstream = imagesStorageStream.openDownloadStream(
            new Types.ObjectId(imageId)
          );
          readstream.pipe(res);
        } else {
          res.status(404).json({
            message: "Not an image",
          });
        }
      });
  },
  uploadVideos: async (req, res, next) => {
    try {
      console.log(req.files);
    } catch (err) {
      console.error(err);
      return;
    }

    res.status(200).send(req.files);
  },
  getVideo: async (req, res, next) => {
    const videoId = req.params.id;

    const videosStorageStream = dbConfig.getVideosStorageStream();

    videosStorageStream
      .find({ _id: new Types.ObjectId(videoId) })
      .toArray(function (err, files) {
        const file = files[0];

        // Check if file
        if (!file || file.length === 0) {
          return res.status(404).json({
            message: "No file exists",
          });
        }

        // Check if image
        if (
          file.contentType === "video/mp4" ||
          file.contentType === "video/avi"
        ) {
          // Read output to browser
          var readstream = videosStorageStream.openDownloadStream(
            new Types.ObjectId(videoId)
          );
          readstream.pipe(res);
        } else {
          res.status(404).json({
            message: "Not a video",
          });
        }
      });
  },
};
