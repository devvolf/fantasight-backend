import { Router } from "express";
import { catchAsync } from "../middlewares/errors.js";
import AuthController from "../controllers/authController.js";
import {
  verifyRegistrationPassword,
  verifyRegistrationDuplicateUsernameOrEmail,
} from "../middlewares/verifyRegistration.js";

export default () => {
  const router = Router();

  router.post(
    "/register",
    [verifyRegistrationPassword, verifyRegistrationDuplicateUsernameOrEmail],
    catchAsync(AuthController.register)
  );

  router.post("/login", catchAsync(AuthController.login));

  router.get("/token", catchAsync(AuthController.token));

  router.delete("/logout", catchAsync(AuthController.logout));

  return router;
};
