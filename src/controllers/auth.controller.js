import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import UserToken from "../models/userToken.model.js";

export default {
  register: async (req, res, next) => {
    const { username, email, password } = req.body;

    new User({
      username,
      email,
      password: bcrypt.hashSync(password, 8),
    }).save((err) => {
      if (err) {
        return next(err);
      }

      res.status(200).send({ message: "User created" });
    });
  },

  login: async (req, res, next) => {
    const { username, password } = req.body;

    User.findOne({ username }).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        res.status(404).send({ message: "User not found" });
        return;
      }

      if (user) {
        const passwordValid = bcrypt.compareSync(password, user.password);

        if (!passwordValid) {
          res.status(401).send({ message: "Password not valid" });
          return;
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        UserToken.findOne({ userId: user.id }).exec((err, userToken) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          if (!userToken) {
            new UserToken({
              userId: user.id,
              access_token: accessToken,
              refresh_token: refreshToken,
            }).save((err) => {
              if (err) {
                console.log("Error", err);
                res.status(500).send({ message: "Internal Server Error" });
                return;
              }

              console.log("Generated user token");
            });

            return;
          }

          userToken
            .update({ access_token: accessToken, refresh_token: refreshToken })
            .exec((err) => {
              if (err) {
                res.status(500).send({ message: "Internal Server Error" });
                return;
              }

              console.log("Access token updated");
            });
        });

        res.status(200).send({ accessToken, refreshToken });
      }
    });
  },

  token: async (req, res, next) => {
    const refreshToken = req.body.token;

    if (!refreshToken) {
      return res.sendStatus(401);
    }

    UserToken.findOne({ refresh_token: refreshToken }).exec(
      (err, userToken) => {
        if (err) {
          res.status(500).send({ message: "Internal Server Error" });
          return;
        }

        if (!userToken) {
          res.status(401).send({ message: "Unauthenticated" });
          return;
        }

        jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET,
          (error, user) => {
            if (error) {
              res.status(401);
            }

            const accessToken = generateAccessToken(user.id);

            userToken.update({ access_token: accessToken }).exec((err) => {
              if (err) {
                res.status(500).send({ message: "Internal Server Error" });
                return;
              }

              console.log("Access token updated");
            });
            res.status(200).send({ accessToken });
          }
        );
      }
    );
  },

  logout: (req, res, next) => {
    const refreshToken = req.body.token;

    UserToken.remove({ refresh_token: refreshToken }).exec((err) => {
      if (err) {
        res.status(500).send({ message: "Internal Server Error" });
        return;
      }

      console.log("Refresh token removed");
    });

    res.status(204).send({ message: "Logged out" });
  },
};

const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1200s",
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET);
};
