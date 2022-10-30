import { Types } from "mongoose";
import Genre from "../models/genre.model.js";
import Characteristic from "../models/characteristic.model.js";
import Film from "../models/film.model.js";

export default {
  getFilmsByGenreKeyword: async (searchText) => {
    const genres = await Genre.find({
      $text: {
        $search: searchText,
      },
    }).exec();

    const genreIds = genres.map((it) => new Types.ObjectId(it._id));

    return await Film.find({
      genres: {
        $in: genreIds,
      },
    })
      .populate("genres")
      .populate("characteristics");
  },

  getFilmsByCharacteristicKeyword: async (searchText) => {
    const characteristics = await Characteristic.find({
      $text: {
        $search: searchText,
      },
    }).exec();

    const characteristicIds = characteristics.map(
      (it) => new Types.ObjectId(it._id)
    );

    return await Film.find({
      genres: {
        $in: characteristicIds,
      },
    })
      .populate("genres")
      .populate("characteristics");
  },

  getFilmsByTitleKeyword: async (searchText) => {
    return await Film.find({
      $text: {
        $search: searchText,
      },
    })
      .populate("genres")
      .populate("characteristics");
  },
};
