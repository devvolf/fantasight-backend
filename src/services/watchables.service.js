import { Types } from "mongoose";
import Watchable from "../models/watchable.model.js";
import Genre from "../models/genre.model.js";
import Characteristic from "../models/characteristic.model.js";
import { WatchableTypes } from "../utils/consts.js";

const searchTextWatchables = async (searchText) => {
  let results = new Set();

  const genreKeywordWatchables = await getWatchablesByGenreKeyword(searchText);

  results = new Set([...results, ...genreKeywordWatchables]);

  const characteristicKeywordWatchables =
    await getWatchablesByCharacteristicKeyword(searchText);

  results = new Set([...results, ...characteristicKeywordWatchables]);

  const titleKeywordWatchables = await getWatchablesByTitleKeyword(searchText);

  results = new Set([...results, ...titleKeywordWatchables]);

  return Array.from(results);
};

const getWatchablesByGenreKeyword = async (searchText) => {
  const genres = await Genre.find({
    $text: {
      $search: searchText,
    },
  }).exec();

  const genreIds = genres.map((it) => new Types.ObjectId(it._id));

  return await Watchable.find({
    genres: {
      $in: genreIds,
    },
  })
    .populate("genres")
    .populate("characteristics");
};

const getWatchablesByCharacteristicKeyword = async (searchText) => {
  const characteristics = await Characteristic.find({
    $text: {
      $search: searchText,
    },
  }).exec();

  const characteristicIds = characteristics.map(
    (it) => new Types.ObjectId(it._id)
  );

  return await Watchable.find({
    genres: {
      $in: characteristicIds,
    },
  })
    .populate("genres")
    .populate("characteristics");
};

const getWatchablesByTitleKeyword = async (searchText) => {
  return await Watchable.find({
    $text: {
      $search: searchText,
    },
  })
    .populate("genres")
    .populate("characteristics");
};

export default {
  getAll: async (searchText, genreIds, characteristicIds, type = null) => {
    let query = {};

    if (searchText) {
      return searchTextWatchables(searchText);
    }

    if (genreIds && genreIds.length) {
      query.genres = {
        $in: [...genreIds.map((it) => new Types.ObjectId(it))],
      };
    }

    if (characteristicIds && characteristicIds.length) {
      query.characteristics = {
        $in: [...characteristicIds.map((it) => new Types.ObjectId(it))],
      };
    }

    if (type) {
      switch (type) {
        case WatchableTypes.Film:
          query.type = "Film";
          break;
        case WatchableTypes.Serie:
          query.type = "Serie";
          break;
        default:
          console.error(`Unsupported watchable type: ${type}`);
          break;
      }
    }

    return Watchable.find(query)
      .populate("genres")
      .populate("characteristics")
      .populate("episodes")
      .exec();
  },
};
