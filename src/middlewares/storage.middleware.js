import multer from "multer";
import dbConfig from "../configs/database.config.js";

export default multer({ storage: dbConfig.imagesStorage }).single('file');
