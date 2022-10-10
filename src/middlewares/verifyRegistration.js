import User from "../models/user.model.js";
import { MIN_PASSWORD_LENGTH } from "../utils/consts.js";

export const verifyRegistrationDuplicateUsernameOrEmail = (req, res, next) => {
  const { username, email } = req.body;

  User.findOne({ username }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return next();
    }

    if (user) {
      res.status(400).send({ username: "Username already in use" });
      return next();
    }
  });

  User.findOne({ email }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return next();
    }

    if (user) {
      res.status(400).send({ email: "Email already in use" });
      return next();
    }
  });

  return next();
};

export const verifyRegistrationPassword = (req, res, next) => {
  const { password } = req.body;

  if (!password) {
    res.status(400).send({ message: "Password is empty" });
    return;
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    res.status(400).send({ message: "Password is too short" });
    return;
  }

  return next();
};
