import mongoose from "mongoose";
import { EMAIL_REGEX } from "../utils/consts.js";

const User = mongoose.model(
  "User",
  new mongoose.Schema(
    {
      username: {
        type: String,
        min: [6, "Username too short"],
        max: 50,
        required: [true, "Username is required"],
        unique: true,
      },
      email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        validate: {
          validator: (value) => EMAIL_REGEX.test(value),
          message: "Email format invalid"
        }
      },
      password: {
        type: String,
        required: [true, "Password is required"],
      },
    },
    {
      timestamps: true, // created_at / updated_at
    }
  )
);

export default User;
