import { Router } from "express";
import { catchAsync } from "../middlewares/errors.js";
import StorageController from "../controllers/storage.controller.js";
import upload from "../middlewares/storage.middleware.js";

export default () => {
  const router = Router();

  router.get("/images/:id", catchAsync(StorageController.getImage));
  router.post("/images", upload, catchAsync(StorageController.uploadImage));

  return router;
};
