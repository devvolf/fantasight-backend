import mongoose from "mongoose";
import { EMAIL_REGEX } from "../utils/consts.js";

const User = mongoose.model(
  "User",
  new mongoose.Schema(
    {
      username: {
        type: String,
        minLength: [5, "Username too short"],
        maxLength: [50, "Username too long"],
        required: [true, "Username is required"],
        unique: true,
      },
      email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        validate: {
          validator: (value) => EMAIL_REGEX.test(value),
          message: "Email format invalid",
        },
      },
      password: {
        type: String,
        required: [true, "Password is required"],
      },
      role: {
        type: String,
        required: [true, "Role is required"],
      },
    },
    {
      timestamps: true, // created_at / updated_at
    }
  )
);

export default User;
