import multer from "multer";
import dbConfig from "../configs/database.config.js";

export const uploadImages = multer({ storage: dbConfig.imagesStorage }).array(
  "files"
);
export const uploadVideos = multer({ storage: dbConfig.videosStorage }).array(
  "files"
);
