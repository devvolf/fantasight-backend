import Genre from "../models/genre.model.js";

export const verifyDuplicateGenreName = async (req, res, next) => {
  const { name } = req.body;

  Genre.findOne({ name }).exec((err, genre) => {
    if (err) {
      res.status(500).send({ message: err });
    }

    if (genre) {
      res
        .status(400)
        .send({ name: "Genre with given name already exists" });
      return;
    }

    return next();
  });
};
