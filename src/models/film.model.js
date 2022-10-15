import mongoose, { Schema } from "mongoose";

const Film = mongoose.model(
  "Film",
  new mongoose.Schema(
    {
      title: {
        type: String,
        minLength: [1, "Title too short"],
        required: [true, "Title is required"],
      },
      description: {
        type: String,
        minLength: [1, "Title too short"],
        required: [true, "Description is required"],
      },
      year: {
        type: Number,
      },
      posterUrl: {
        type: String,
        required: true,
      },
      genres: [
        {
          type: Schema.Types.ObjectId,
          ref: "Genre",
        },
      ],
      characteristics: [
        {
          type: Schema.Types.ObjectId,
          ref: "Characteristic",
        },
      ],
      
    },
    {
      timestamps: true, // created_at / updated_at
    }
  )
);

export default Film;
