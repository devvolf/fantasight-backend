import { Router } from "express";
import { catchAsync } from "../middlewares/errors.js";
import FilmController from "../controllers/filmController.js";

export default () => {
  const router = Router();

  router.get("/films", catchAsync(FilmController.getAll));

  return router;
};
