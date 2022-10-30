import { Router } from "express";
import { catchAsync } from "../middlewares/errors.js";
import FilmController from "../controllers/film.controller.js";

export default () => {
  const router = Router();

  router.get("/films", catchAsync(FilmController.getAll));
  router.post("/films", catchAsync(FilmController.add));
  router.put("/films/:id", catchAsync(FilmController.update));
  router.delete("/films/:id", catchAsync(FilmController.delete));

  return router;
};
