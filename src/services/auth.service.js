import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const initializeAdmin = () => {
  User.findOne({
    role: "admin",
  }).exec((err, user) => {
    if (err) {
      console.log("Error during finding admin user");
      return;
    }

    if (!user) {
      new User({
        username: "admin",
        email: "admin@fantasight.com",
        password: bcrypt.hashSync("admin", 8),
        role: "admin",
      }).save((err) => {
        if (err) {
          console.log("Error initializing new admin user", err);
          return;
        }

        console.log("New admin user initialized");
      });
      return;
    }
  });
};
