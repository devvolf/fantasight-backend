import Characteristic from "../models/characteristic.model.js";

export default {
  getAll: async (req, res, next) => {
    Characteristic.find({}).exec((err, characteristics) => {
      if (err) {
        return next(err);
      }

      res.status(200).send(characteristics);
    });
  },

  add: async (req, res, next) => {
    const { name, description } = req.body;

    new Characteristic({
      name,
      description,
    }).save((err) => {
      if (err) {
        return next(err);
      }

      res.status(200).send({ message: "Characteristic created" });
    });
  },

  update: async (req, res, next) => {
    const { id } = req.params;
    const { name, description } = req.body;

    Characteristic.findById(id).exec((err, characteristic) => {
      if (err) {
        return next(err);
      }

      if (!characteristic) {
        res.status(404).send({ message: "Characteristic not found" });
        return;
      }

      characteristic.update({ name, description }).exec((err) => {
        if (err) {
          return next(err);
        }

        res.status(200).send({ message: "Characteristic updated" });
      });
    });
  },

  delete: async (req, res, next) => {
    const { id } = req.params;

    Characteristic.findById(id).exec((err, characteristic) => {
      if (err) {
        return next(err);
      }

      if (!characteristic) {
        res.status(404).send({ message: "Characteristic not found" });
        return;
      }

      characteristic.remove((err) => {
        if (err) {
          return next(err);
        }

        res.status(204).send({ message: "Characteristic deleted" });
      });
    });
  },
};
