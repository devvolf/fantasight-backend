import watchablesService from "../services/watchables.service.js";
import Watchable from "../models/watchable.model.js";

export default {
  getAll: async (req, res, next) => {
    const { genreIds, characteristicIds } = req.body;
    const { searchText } = req.query;

    const results = await watchablesService.getAll(
      searchText,
      genreIds,
      characteristicIds
    );

    res.status(200).send(results);
  },

  delete: async (req, res, next) => {
    const { id } = req.params;

    Watchable.findById(id).exec((err, watchable) => {
      if (err) {
        return next(err);
      }

      if (!watchable) {
        res.status(404).send({ message: "Watchable not found" });
        return;
      }

      watchable.remove((err) => {
        if (err) {
          return next(err);
        }

        res.status(204).send({ message: "Watchable deleted" });
      });
    });
  },
};
