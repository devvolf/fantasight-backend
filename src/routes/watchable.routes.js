import { Router } from "express";
import { catchAsync } from "../middlewares/errors.js";
import GenreController from "../controllers/genre.controller.js";
import { verifyDuplicateGenreName } from "../middlewares/genre.middleware.js";
import CharacteristicController from "../controllers/characteristic.controller.js";
import { verifyDuplicateCharacteristicName } from "../middlewares/characteristic.middleware.js";
import watchableController from "../controllers/watchable.controller.js";
import FilmController from "../controllers/film.controller.js";
import SerieController from "../controllers/serie.controller.js";
import {
  validateToken,
  validateAdminAccess,
} from "../middlewares/auth.middleware.js";

export default () => {
  const router = Router();

  // Genres endpoints.
  router.get(
    "/genres",
    [validateToken, validateAdminAccess],
    catchAsync(GenreController.getAll)
  );
  router.post(
    "/genres",
    [validateToken, validateAdminAccess, verifyDuplicateGenreName],
    catchAsync(GenreController.add)
  );
  router.put(
    "/genres/:id",
    [validateToken, validateAdminAccess, verifyDuplicateGenreName],
    catchAsync(GenreController.update)
  );
  router.delete(
    "/genres/:id",
    [validateToken, validateAdminAccess],
    catchAsync(GenreController.delete)
  );

  // Characteristics endpoints.
  router.get(
    "/characteristics",
    [validateToken, validateAdminAccess],
    catchAsync(CharacteristicController.getAll)
  );
  router.post(
    "/characteristics",
    [validateToken, validateAdminAccess, verifyDuplicateCharacteristicName],
    catchAsync(CharacteristicController.add)
  );
  router.put(
    "/characteristics/:id",
    [validateToken, validateAdminAccess, verifyDuplicateCharacteristicName],
    catchAsync(CharacteristicController.update)
  );
  router.delete(
    "/characteristics/:id",
    [validateToken, validateAdminAccess],
    catchAsync(CharacteristicController.delete)
  );

  // Watchables endpoints.
  router.get(
    "",
    [validateToken, validateAdminAccess],
    catchAsync(watchableController.getAll)
  );
  router.delete(
    "/:id",
    [validateToken, validateAdminAccess],
    catchAsync(watchableController.delete)
  );

  // Films endpoints.
  router.get(
    "/films",
    [validateToken, validateAdminAccess],
    catchAsync(FilmController.getAll)
  );
  router.post(
    "/films",
    [validateToken, validateAdminAccess],
    catchAsync(FilmController.add)
  );
  router.put(
    "/films/:id",
    [validateToken, validateAdminAccess],
    catchAsync(FilmController.update)
  );

  // Series endpoints.
  router.get(
    "/series",
    [validateToken, validateAdminAccess],
    catchAsync(SerieController.getAll)
  );
  router.post(
    "/series",
    [validateToken, validateAdminAccess],
    catchAsync(SerieController.add)
  );
  router.put(
    "/series/:id",
    [validateToken, validateAdminAccess],
    catchAsync(SerieController.update)
  );

  return router;
};
