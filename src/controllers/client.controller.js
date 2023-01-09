import watchablesService from "../services/watchables.service.js";
import Watchable from "../models/watchable.model.js";

export default {
  getWatchables: async (req, res, next) => {
    const { genreIds, characteristicIds } = req.body;
    const { searchText } = req.query;

    const results = await watchablesService.getAll(
      searchText,
      genreIds,
      characteristicIds
    );

    res.status(200).send(results);
  },
};
