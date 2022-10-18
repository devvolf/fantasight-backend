import { Router } from "express";
import { catchAsync } from "../middlewares/errors.js";
import CharacteristicController from "../controllers/characteristic.controller.js";
import { verifyDuplicateCharacteristicName } from "../middlewares/characteristic.middleware.js";

export default () => {
  const router = Router();

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

  return router;
};
