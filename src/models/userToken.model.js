import mongoose from "mongoose";

const UserToken = mongoose.model(
  "UserToken",
  new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
      },
      access_token: {
        type: String,
        required: true,
      },
      refresh_token: {
        type: String,
        required: true,
      }
    },
    {
      timestamps: true, // created_at / updated_at
    }
  )
);

export default UserToken;
