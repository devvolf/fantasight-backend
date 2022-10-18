import { Router } from "express";
import { catchAsync } from "../middlewares/errors.js";
import FilmController from "../controllers/film.controller.js";

export default () => {
  const router = Router();

  router.get("/films", catchAsync(FilmController.getAll));

  return router;
};
