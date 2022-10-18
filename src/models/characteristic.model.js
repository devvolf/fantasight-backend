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
        minLength: [1, "Description too short"],
      },
    },
    {
      timestamps: true, // created_at / updated_at
    }
  )
);

export default Characteristic;