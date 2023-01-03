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
  })
);

export default Serie;
