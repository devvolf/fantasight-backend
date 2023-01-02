import mongoose from "mongoose";
import Watchable from "./watchable.model.js";

const Film = Watchable.discriminator(
  "Film",
  new mongoose.Schema({
    streamUrl: {
      type: String,
      required: [true, "Video is required"],
    },
  }).index({ title: "text" })
);

export default Film;
