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
      role: "user",
    }).save((err) => {
      if (err) {
        return next(err);
      }

      res.status(200).send({ message: "User created" });
    });
  },

  login: async (req, res, next) => {
    const { username, password } = req.body;

    User.findOne({ username, role: "user" }).exec((err, user) => {
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

        const accessToken = generateAccessToken(user.id, user.role);
        const refreshToken = generateRefreshToken(user.id, user.role);

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

        const userData = {
          id: user._id,
          username: user.username,
          email: user.email,
        };

        res.status(200).send({ accessToken, refreshToken, user: userData });
      }
    });
  },

  adminLogin: async (req, res, next) => {
    const { username, password } = req.body;

    User.findOne({ username, role: "admin" }).exec((err, user) => {
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

        const accessToken = generateAccessToken(user.id, user.role);
        const refreshToken = generateRefreshToken(user.id, user.role);

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

        const userData = {
          id: user._id,
          username: user.username,
          email: user.email,
        };

        res.status(200).send({ accessToken, refreshToken, user: userData });
      }
    });
  },

  token: async (req, res, next) => {
    const { refreshToken } = req.body;

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
          res.status(401).send({ message: "Unauthorized" });
          return;
        }

        jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET,
          (error, user) => {
            if (error) {
              res.status(401).send({ message: "Unauthorized" });
            }

            const accessToken = generateAccessToken(user.id, user.role);

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

  logout: async (req, res, next) => {
    const { refreshToken } = req.body;

    UserToken.remove({ refresh_token: refreshToken }).exec((err) => {
      if (err) {
        res.status(500).send({ message: "Internal Server Error" });
        return;
      }

      console.log("Refresh token removed");
    });

    res.status(204).send({ message: "Logged out" });
  },

  changePassword: async (req, res, next) => {
    const { id, password } = req.body;
    const { authorization } = req.headers;

    const accessToken = authorization.split(" ")[1];

    if (!accessToken) {
      res.status(401).send({ message: "Unauthorized" });
      return;
    }

    const payload = jwt.decode(accessToken);

    if (!payload) {
      res.status(401).send({ message: "Unauthorized" });
      return;
    }

    if (payload.id !== id) {
      res.status(401).send({ message: "Unauthorized" });
      return;
    }

    User.findById(id).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        res.status(404).send({ message: "User not found" });

        return;
      }

      const newPassword = bcrypt.hashSync(password, 8);

      user.update({ password: newPassword }).exec((err) => {
        if (err) {
          res.status(500).send({ message: "Something went wrong" });
        }

        res.status(200).send({ message: "Password updated" });
      });
    });
  },
};

const generateAccessToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "10s",
  });
};

const generateRefreshToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.REFRESH_TOKEN_SECRET);
};
