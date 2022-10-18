import Film from "../models/film.model.js";

export default {
  getAll: async (req, res, next) => {
    const films = await Film.find({}).exec((err) => {
      if (err) {
        return next(err);
      }
    });

    res.status(200).send(films);
  },
};
