import { Types } from "mongoose";
import Serie from "../models/serie.model.js";
import SerieEpisode from "../models/serieEpisode.model.js";
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
      WatchableTypes.Serie
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
      posterImageId,
      episodes,
    } = req.body;

    let posterUrl;

    if (posterImageId) {
      posterUrl = await imagesService.getImageUrlById(posterImageId);
    }

    let genres;
    let characteristics;

    if (genreIds && genreIds.length) {
      genres = genreIds.map((it) => new Types.ObjectId(it));
    }

    if (characteristicIds && characteristicIds.length) {
      characteristics = characteristicIds.map((it) => new Types.ObjectId(it));
    }

    const episodePromises = [];

    for (let i = 0; i < episodes.length; i++) {
      const episode = episodes[i];
      const episodePosterUrl = await imagesService.getImageUrlById(
        episode.posterImageId
      );
      const episodeStreamUrl = await videosService.getVideoUrlById(
        episode.videoId
      );

      episodePromises.push(
        new SerieEpisode({
          title: episode.title,
          description: episode.description,
          seasonIndex: episode.seasonIndex,
          posterUrl: episodePosterUrl,
          streamUrl: episodeStreamUrl,
        }).save()
      );
    }

    const savedEpisodes = await Promise.all([...episodePromises]);
    const savedEpisodesIds = savedEpisodes.map((it) => it._id);

    new Serie({
      title,
      description,
      year,
      posterUrl,
      genres,
      characteristics,
      episodes: savedEpisodesIds,
    }).save((err) => {
      if (err) {
        return next(err);
      }

      res.status(200).send({ message: "Serie created" });
    });
  },

  update: async (req, res, next) => {
    const {
      title,
      description,
      year,
      genreIds,
      characteristicIds,
      posterImageId,
      episodes,
    } = req.body;

    const { id } = req.params;

    let posterUrl;

    if (posterImageId) {
      posterUrl = await imagesService.getImageUrlById(posterImageId);
    }

    let genres;
    let characteristics;

    if (genreIds && genreIds.length) {
      genres = genreIds.map((it) => new Types.ObjectId(it));
    }

    if (characteristicIds && characteristicIds.length) {
      characteristics = characteristicIds.map((it) => new Types.ObjectId(it));
    }

    const episodesPromises = [];

    for (let i = 0; i < episodes.length; i++) {
      const episode = episodes[i];

      let episodePosterUrl;
      let episodeStreamUrl;

      if (episode.posterImageId) {
        episodePosterUrl = await imagesService.getImageUrlById(
          episode.posterImageId
        );
      }

      if (episode.videoId) {
        episodeStreamUrl = await videosService.getVideoUrlById(episode.videoId);
      }

      if (episode.id) {
        episodesPromises.push(
          SerieEpisode.findById(new Types.ObjectId(episode.id)).then(
            (foundEpisode) => {
              if (foundEpisode) {
                foundEpisode
                  .update({
                    title: episode.title,
                    description: episode.description,
                    seasonIndex: episode.seasonIndex,
                    posterUrl: episodePosterUrl,
                    streamUrl: episodeStreamUrl,
                  })
                  .exec();
              }

              return foundEpisode;
            }
          )
        );
      } else {
        episodesPromises.push(
          new SerieEpisode({
            title: episode.title,
            description: episode.description,
            seasonIndex: episode.seasonIndex,
            posterUrl: episodePosterUrl,
            streamUrl: episodeStreamUrl,
          }).save()
        );
      }
    }

    await Serie.findById(new Types.ObjectId(id)).exec(async (err, serie) => {
      if (err) {
        return next(err);
      }

      if (!serie) {
        res.status(404).send({ message: "Serie not found" });
        return;
      }

      const updatedEpisodes = await Promise.all([...episodesPromises]);
      const savedEpisodesIds = updatedEpisodes.map((it) => it._id);

      serie
        .update({
          title,
          description,
          year,
          posterUrl,
          genres,
          characteristics,
          episodes: savedEpisodesIds,
        })
        .exec(async (err) => {
          if (err) {
            return next(err);
          }

          res.status(200).send({ message: "Serie updated" });
        });
    });
  },

  delete: async (req, res, next) => {
    const { id } = req.params;

    Serie.findById(id).exec((err, serie) => {
      if (err) {
        return next(err);
      }

      if (!serie) {
        res.status(404).send({ message: "Serie not found" });
        return;
      }

      serie.remove((err) => {
        if (err) {
          return next(err);
        }

        res.status(204).send({ message: "Serie deleted" });
      });
    });
  },
};
