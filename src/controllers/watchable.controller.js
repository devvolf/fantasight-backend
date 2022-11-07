import watchablesService from "../services/watchables.service.js";

export default {
  getAll: async (req, res, next) => {
    const { searchText, genreIds, characteristicIds } = req.body;

    const results = await watchablesService.getAll(
      searchText,
      genreIds,
      characteristicIds
    );

    res.status(200).send(results);
  },
};
