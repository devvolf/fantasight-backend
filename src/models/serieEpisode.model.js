import mongoose, { Schema } from "mongoose";

const SerieEpisode = mongoose.model(
  "SerieEpisode",
  new mongoose.Schema(
    {
      title: {
        type: String,
        minLength: [1, "Title too short"],
        required: [true, "Title is required"],
      },
      description: {
        type: String,
        minLength: [1, "Description too short"],
        required: [true, "Description is required"],
      },
      posterUrl: {
        type: String,
      },
      streamUrl: {
        type: String,
      },
    },
    {
      timestamps: true, // created_at / updated_at
    }
  ).index({ title: "text" })
);

export default SerieEpisode;
