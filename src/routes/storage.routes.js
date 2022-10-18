import { Router } from "express";
import { catchAsync } from "../middlewares/errors.js";
import StorageController from "../controllers/storage.controller.js";
import upload from "../middlewares/storage.middleware.js";

export default () => {
  const router = Router();

  // router.get("/images/:id", catchAsync(StorageController));
  router.post(
    "/images",
    upload.single("file"),
    catchAsync(StorageController.uploadImage)
  );

  return router;
};
