import Characteristic from "../models/characteristic.model.js";

export const verifyDuplicateCharacteristicName = async (req, res, next) => {
  const { name } = req.body;

  Characteristic.findOne({ name }).exec((err, characteristic) => {
    if (err) {
      res.status(500).send({ message: err });
    }

    if (characteristic) {
      res
        .status(400)
        .send({ name: "Characteristic with given name already exists" });
      return;
    }

    return next();
  });
};
