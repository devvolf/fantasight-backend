import dbConfig from "../configs/database.config.js";
import { Types } from "mongoose";

export default {
  uploadImages: async (req, res, next) => {
    try {
      // console.log(req.files);
    } catch (err) {
      console.error(err);
      return;
    }

    res.status(200).send(req.files);
  },
  getImage: async (req, res, next) => {
    const imageId = req.params.id;

    const imagesStorageBucket = dbConfig.getImagesStorageBucket();

    imagesStorageBucket
      .find({ _id: new Types.ObjectId(imageId) })
      .toArray(function (err, files) {
        const file = files[0];

        if (!file || file.length === 0) {
          return res.status(404).json({
            message: "No file exists",
          });
        }

        if (
          file.contentType === "image/jpeg" ||
          file.contentType === "image/png"
        ) {
          var readstream = imagesStorageBucket.openDownloadStream(
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
      // console.log(req.files);
    } catch (err) {
      console.error(err);
      return;
    }

    res.status(200).send(req.files);
  },
  getVideo: async (req, res, next) => {
    const videoId = req.params.id;
    const { range } = req.headers;

    if (!range) {
      res.status(400).send("Range required");
    }

    const videosStorageBucket = dbConfig.getVideosStorageBucket();

    videosStorageBucket
      .find({ _id: new Types.ObjectId(videoId) })
      .toArray(function (err, files) {
        const file = files[0];

        if (!file || file.length === 0) {
          return res.status(404).json({
            message: "No file exists",
          });
        }

        if (file.contentType === "video/mp4") {
          const start = Number(range.replace(/\D/g, ""));
          const end = file.length - 1;

          // if (start >= file.length) {
          //   res
          //     .status(416)
          //     .send(
          //       "Requested range not satisfiable\n" +
          //         start +
          //         " >= " +
          //         file.length
          //     );
          //   return;
          // }

          const headers = {
            "Content-Range": `bytes ${start}-${end}/${file.length}`,
            "Accept-Ranges": "bytes",
            "Content-Length": file.length,
            "Content-Type": "video/mp4",
          };

          res.writeHead(206, headers);

          const readstream = videosStorageBucket.openDownloadStream(
            new Types.ObjectId(videoId),
            { start, end: end + 1 }
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
