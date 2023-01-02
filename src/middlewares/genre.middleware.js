import Genre from "../models/genre.model.js";

export const verifyDuplicateGenreName = async (req, res, next) => {
  const { name } = req.body;
  const { id } = req.params;

  Genre.findOne({ name }).exec((err, genre) => {
    if (err) {
      res.status(500).send({ message: err });
    }

    if (genre) {
      if (!id) {
        res.status(400).send({ message: "Genre with given name already exists" });
        return;
      }

      if (id !== genre._id.toString()) {
        res.status(400).send({ message: "Genre with given name already exists" });
        return;
      }
    }

    return next();
  });
};
