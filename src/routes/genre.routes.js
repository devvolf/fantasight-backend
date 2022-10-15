import { Router } from "express";
import { catchAsync } from "../middlewares/errors.js";
import GenreController from "../controllers/genreController.js";
import { verifyDuplicateGenreName } from "../middlewares/genreValidation.js";

export default () => {
  const router = Router();

  router.get("/genres", catchAsync(GenreController.getAll));
  router.post(
    "/genres",
    [verifyDuplicateGenreName],
    catchAsync(GenreController.add)
  );
  router.put(
    "/genres/:id",
    [verifyDuplicateGenreName],
    catchAsync(GenreController.update)
  );
  router.delete("/genres/:id", catchAsync(GenreController.delete));

  return router;
};
