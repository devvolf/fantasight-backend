import mongoose, { Schema } from "mongoose";
import Watchable from "./watchable.model.js";

const Serie = Watchable.discriminator(
  "Serie",
  new mongoose.Schema({
    episodes: [
      {
        type: Schema.Types.ObjectId,
        ref: "SerieEpisode",
      },
    ],
  }).index({ title: "text" })
);

export default Serie;
