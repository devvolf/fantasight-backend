import { Router } from "express";
import { catchAsync } from "../middlewares/errors.js";
import ClientController from "../controllers/client.controller.js";
import { validateToken } from "../middlewares/auth.middleware.js";

export default () => {
  const router = Router();

  router.get(
    "/watchables",
    [validateToken],
    catchAsync(ClientController.getWatchables)
  );

  return router;
};
