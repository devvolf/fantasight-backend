import User from "../models/user.model.js";
import { MIN_PASSWORD_LENGTH } from "../utils/consts.js";
import jwt from "jsonwebtoken";
import UserToken from "../models/userToken.model.js";

export const validateSameUserRefreshToken = (req, res, next) => {
  const { refreshToken } = req.body;
  const { authorization } = req.headers;

  const accessToken = authorization.split(" ")[1];

  if (!accessToken) {
    res.status(401).send({ message: "Unauthorized" });
    return;
  }

  if (!refreshToken) {
    res.status(400).status({ message: "No refresh token passed" });
    return;
  }

  UserToken.findOne({ access_token: accessToken }).exec((err, userToken) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (!userToken) {
      res.status(401).send({ message: "Unauthorized" });
      return;
    }

    if (userToken.refresh_token !== refreshToken) {
      res.status(401).send({ message: "Unauthorized" });
      return;
    }

    return next();
  });
};

export const validateToken = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(401).send({ message: "Unauthorized" });
    return;
  }

  const token = authorization.split(" ")[1];

  if (!token) {
    res.status(401).send({ message: "Unauthorized" });
    return;
  }

  UserToken.findOne({ access_token: token }).exec((err, userToken) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (!userToken) {
      res.status(401).send({ message: "Unauthorized" });
      return;
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.status(401).send({ message: "Unauthorized" });
        return;
      }

      return next();
    });
  });
};

export const validateAdminAccess = (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization.split(" ")[1];

  const payload = jwt.decode(token);

  if (!payload) {
    res.status(401).send({ message: "Unauthorized" });
    return;
  }

  const { role } = payload;

  if (!role) {
    res.status(401).send({ message: "Unauthorized" });
    return;
  }

  if (role !== "admin") {
    res.status(401).send({ message: "Unauthorized" });
    return;
  }

  return next();
};

export const verifyRegistrationDuplicateUsernameOrEmail = (req, res, next) => {
  const { username, email } = req.body;

  User.findOne({ username }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user) {
      res.status(400).send({ username: "Username already in use" });
      return;
    }
  });

  User.findOne({ email }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user) {
      res.status(400).send({ email: "Email already in use" });
      return;
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
