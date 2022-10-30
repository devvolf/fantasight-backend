import { Types } from "mongoose";
import Film from "../models/film.model.js";
import imagesService from "../services/images.service.js";
import filmService from "../services/film.service.js";

const searchTextFilms = async (searchText) => {
  let results = new Set();

  const genreKeywordFilms = await filmService.getFilmsByGenreKeyword(
    searchText
  );

  results = new Set([...results, ...genreKeywordFilms]);

  const characteristicKeywordFilms =
    await filmService.getFilmsByCharacteristicKeyword(searchText);

  results = new Set([...results, ...characteristicKeywordFilms]);

  const titleKeywordFilms = await filmService.getFilmsByTitleKeyword(
    searchText
  );

  results = new Set([...results, ...titleKeywordFilms]);

  return Array.from(results);
};

export default {
  getAll: async (req, res, next) => {
    const { genreIds, characteristicIds, searchText } = req.body;

    let query = {};

    if (searchText) {
      const searchTextResults = await searchTextFilms(searchText);
      res.status(200).send(searchTextResults);
      return;
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

    Film.find(query)
      .populate("genres")
      .populate("characteristics")
      .exec((err, films) => {
        if (err) {
          return next(err);
        }

        res.status(200).send(films);
      });
  },

  add: async (req, res, next) => {
    const { title, description, year, genreIds, characteristicIds, imageId } =
      req.body;

    let posterUrl;

    if (imageId) {
      posterUrl = await imagesService.getImageUrlById(imageId);
    }

    let genres;
    let characteristics;

    if (genreIds && genreIds.length) {
      genres = genreIds.map((it) => new Types.ObjectId(it));
    }

    if (characteristicIds && characteristicIds.length) {
      characteristics = characteristicIds.map((it) => new Types.ObjectId(it));
    }

    new Film({
      title,
      description,
      year,
      posterUrl,
      genres,
      characteristics,
    }).save((err) => {
      if (err) {
        return next(err);
      }

      res.status(200).send({ message: "Film created" });
    });
  },

  update: async (req, res, next) => {
    const { title, description, year, genreIds, characteristicIds, imageId } =
      req.body;

    const { id } = req.params;

    let posterUrl;

    if (imageId) {
      posterUrl = await imagesService.getImageUrlById(imageId);
    }

    let genres;
    let characteristics;

    if (genreIds && genreIds.length) {
      genres = genreIds.map((it) => new Types.ObjectId(it));
    }

    if (characteristicIds && characteristicIds.length) {
      characteristics = characteristicIds.map((it) => new Types.ObjectId(it));
    }

    Film.findById(new Types.ObjectId(id)).exec((err, film) => {
      if (err) {
        return next(err);
      }

      if (!film) {
        res.status(404).send({ message: "Film not found" });
        return;
      }

      film
        .update({
          title,
          description,
          year,
          posterUrl,
          genres,
          characteristics,
        })
        .exec((err) => {
          if (err) {
            return next(err);
          }

          res.status(200).send({ message: "Film updated" });
        });
    });
  },

  delete: async (req, res, next) => {
    const { id } = req.params;

    Film.findById(id).exec((err, film) => {
      if (err) {
        return next(err);
      }

      if (!film) {
        res.status(404).send({ message: "Film not found" });
        return;
      }

      film.remove((err) => {
        if (err) {
          return next(err);
        }

        res.status(204).send({ message: "Film deleted" });
      });
    });
  },
};
