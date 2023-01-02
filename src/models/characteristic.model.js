import mongoose from "mongoose";

const Characteristic = mongoose.model(
  "Characteristic",
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
      },
    },
    {
      timestamps: true, // created_at / updated_at
    }
  ).index({ name: "text", description: "text" })
);

export default Characteristic;
