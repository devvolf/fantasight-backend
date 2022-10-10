import mongoose from "mongoose";

export const notFound = (req, res, next) => {
  const err = new Error("404 page not found");
  err.status = 404;
  next(err);
};

export const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => {
      return next(err);
    });
  };
};

export const catchErrors = (err, req, res, next) => {
  if (err instanceof mongoose.Error.ValidationError) {
    let errors = {};

    Object.keys(err.errors).forEach((key) => {
      errors[key] = err.errors[key].message;
    });

    res.status(400).send(errors);
    return next();
  }

  console.error(err);
  res.status(500);
  res.send({
    message: "Something went wrong",
  });
  return;
};
