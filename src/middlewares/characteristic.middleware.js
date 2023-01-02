import Characteristic from "../models/characteristic.model.js";

export const verifyDuplicateCharacteristicName = async (req, res, next) => {
  const { name } = req.body;
  const { id } = req.params;

  Characteristic.findOne({ name }).exec((err, characteristic) => {
    if (err) {
      res.status(500).send({ message: err });
    }

    if (characteristic) {
      if (!id) {
        res
          .status(400)
          .send({ message: "Characteristic with given name already exists" });
        return;
      }

      if (id !== characteristic._id.toString()) {
        res.status(400).send({
          message: "Characteristic with given name already exists",
        });
        return;
      }
    }

    return next();
  });
};
