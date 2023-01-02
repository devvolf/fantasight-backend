import { Router } from "express";
import { catchAsync } from "../middlewares/errors.js";
import StorageController from "../controllers/storage.controller.js";
import {
  uploadImages,
  uploadVideos,
} from "../middlewares/storage.middleware.js";

export default () => {
  const router = Router();

  router.get("/images/:id", catchAsync(StorageController.getImage));
  router.post(
    "/images",
    uploadImages,
    catchAsync(StorageController.uploadImages)
  );

  router.get("/videos/:id", catchAsync(StorageController.getVideo));
  router.post(
    "/videos",
    uploadVideos,
    catchAsync(StorageController.uploadVideos)
  );

  return router;
};
