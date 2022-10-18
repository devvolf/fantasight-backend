import Genre from "../models/genre.model.js";

export default {
  getAll: async (req, res, next) => {
    Genre.find({}).exec((err, genres) => {
      if (err) {
        return next(err);
      }

      res.status(200).send(genres);
    });
  },

  add: async (req, res, next) => {
    const { name, description } = req.body;

    new Genre({
      name,
      description,
    }).save((err) => {
      if (err) {
        return next(err);
      }

      res.status(200).send({ message: "Genre created" });
    });
  },

  update: async (req, res, next) => {
    const { id } = req.params;
    const { name, description } = req.body;

    Genre.findById(id).exec((err, genre) => {
      if (err) {
        return next(err);
      }

      if (!genre) {
        res.status(404).send({ message: "Genre not found" });
        return;
      }

      genre.update({ name, description }).exec((err) => {
        if (err) {
          return next(err);
        }

        res.status(200).send({ message: "Genre updated" });
      });
    });
  },

  delete: async (req, res, next) => {
    const { id } = req.params;

    Genre.findById(id).exec((err, genre) => {
      if (err) {
        return next(err);
      }

      if (!genre) {
        res.status(404).send({ message: "Genre not found" });
        return;
      }

      genre.remove((err) => {
        if (err) {
          return next(err);
        }

        res.status(204).send({ message: "Genre deleted" });
      });
    });
  },
};
