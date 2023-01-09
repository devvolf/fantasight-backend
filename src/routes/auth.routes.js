import { Router } from "express";
import { catchAsync } from "../middlewares/errors.js";
import AuthController from "../controllers/auth.controller.js";
import {
  validateToken,
  validateSameUserRefreshToken,
  verifyRegistrationPassword,
  verifyRegistrationDuplicateUsernameOrEmail,
} from "../middlewares/auth.middleware.js";

export default () => {
  const router = Router();

  router.post(
    "/register",
    [verifyRegistrationPassword, verifyRegistrationDuplicateUsernameOrEmail],
    catchAsync(AuthController.register)
  );

  router.post("/login", catchAsync(AuthController.login));

  router.post("/admin/login", catchAsync(AuthController.adminLogin));

  router.post(
    "/token",
    [validateSameUserRefreshToken],
    catchAsync(AuthController.token)
  );

  router.delete(
    "/logout",
    [validateToken, validateSameUserRefreshToken],
    catchAsync(AuthController.logout)
  );

  router.post(
    "/change-password",
    [validateToken],
    catchAsync(AuthController.changePassword)
  );

  return router;
};
