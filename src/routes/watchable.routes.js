import { Router } from "express";
import { catchAsync } from "../middlewares/errors.js";
import GenreController from "../controllers/genre.controller.js";
import { verifyDuplicateGenreName } from "../middlewares/genre.middleware.js";
import CharacteristicController from "../controllers/characteristic.controller.js";
import { verifyDuplicateCharacteristicName } from "../middlewares/characteristic.middleware.js";
import watchableController from "../controllers/watchable.controller.js";
import FilmController from "../controllers/film.controller.js";
import SerieController from "../controllers/serie.controller.js";

export default () => {
  const router = Router();

  // Genres endpoints.
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

  // Characteristics endpoints.
  router.get("/characteristics", catchAsync(CharacteristicController.getAll));
  router.post(
    "/characteristics",
    [verifyDuplicateCharacteristicName],
    catchAsync(CharacteristicController.add)
  );
  router.put(
    "/characteristics/:id",
    [verifyDuplicateCharacteristicName],
    catchAsync(CharacteristicController.update)
  );
  router.delete(
    "/characteristics/:id",
    catchAsync(CharacteristicController.delete)
  );

  // Watchables endpoints.
  router.get("", catchAsync(watchableController.getAll));
  router.delete("/:id", catchAsync(watchableController.delete));


  // Films endpoints.
  router.get("/films", catchAsync(FilmController.getAll));
  router.post("/films", catchAsync(FilmController.add));
  router.put("/films/:id", catchAsync(FilmController.update));
  router.delete("/films/:id", catchAsync(FilmController.delete));

  // Series endpoints.
  router.get("/series", catchAsync(SerieController.getAll));
  router.post("/series", catchAsync(SerieController.add));
  // router.put("/series/:id", catchAsync(SerieController.update));
  // router.delete("/series/:id", catchAsync(SerieController.delete));

  return router;
};
