import { Router } from "express";
// import { catchAsync } from "../middlewares/errors.";
import AuthController from "../controllers/authController.js";

export default () => {
  const router = Router();

  router.post(
    "/register",
    AuthController.register
  );

  router.post("/login", AuthController.login);

  router.get("/token", AuthController.token);

  router.delete("/logout", AuthController.logout);

  return router;
};
