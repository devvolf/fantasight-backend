import mongoose from "mongoose";

const Genre = mongoose.model(
  "Genre",
  new mongoose.Schema(
    {
      name: {
        type: String,
        minLength: [3, "Name too short"],
        required: [true, "Title is required"],
        unique: true,
      },
      description: {
        type: String,
        minLength: [1, "Description too short"],
      },
    },
    {
      timestamps: true, // created_at / updated_at
    }
  ).index({ name: "text" })
);

export default Genre;
