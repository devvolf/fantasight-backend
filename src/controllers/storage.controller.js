import multer from "multer";
import dbConfig from "../configs/database.config.js";

export default {
  // upload,
  uploadImage: (req, res, next) => {
    try {
      const { file } = req.body;
      console.log(req.file);
    } catch (err) {
      console.error(err);
      return;
    }
  },
};
