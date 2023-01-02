import { Types } from "mongoose";
import Film from "../models/film.model.js";
import imagesService from "../services/images.service.js";
import videosService from "../services/videos.service.js";
import watchablesService from "../services/watchables.service.js";
import { WatchableTypes } from "../utils/consts.js";

export default {
  getAll: async (req, res, next) => {
    const { searchText, genreIds, characteristicIds } = req.body;

    const results = await watchablesService.getAll(
      searchText,
      genreIds,
      characteristicIds,
      WatchableTypes.Film
    );

    res.status(200).send(results);
  },

  add: async (req, res, next) => {
    const {
      title,
      description,
      year,
      genreIds,
      characteristicIds,
      imageId,
      videoId,
    } = req.body;

    const posterUrl = await imagesService.getImageUrlById(imageId);

    const streamUrl = await videosService.getVideoUrlById(videoId);

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
      streamUrl,
    }).save((err) => {
      if (err) {
        return next(err);
      }

      res.status(200).send({ message: "Film created" });
    });
  },

  update: async (req, res, next) => {
    const {
      title,
      description,
      year,
      genreIds,
      characteristicIds,
      imageId,
      videoId,
    } = req.body;

    const { id } = req.params;

    let posterUrl;
    let streamUrl;

    if (imageId) {
      posterUrl = await imagesService.getImageUrlById(imageId);
    }

    if (videoId) {
      streamUrl = await videosService.getVideoUrlById(videoId);
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
          streamUrl,
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
