import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectToDatabase from "./configs/database.js";
import auth from "./routes/auth.routes.js";
import film from "./routes/film.routes.js";
import genre from "./routes/genre.routes.js";
import characteristic from "./routes/characteristic.routes.js";
import { catchErrors } from "./middlewares/errors.js";
import _ from "lodash";

const runApp = async () => {
  console.log("Starting app...");
  await connectToDatabase();

  const app = express();
  const port = 3000;

  const corsOptions = {
    origin: `http://localhost:${port}`,
  };

  app.use(cors(corsOptions));
  app.use(express.static("public"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use("/auth", auth());
  app.use("/genres", genre());
  app.use("/characteristics", characteristic());
  app.use("/films", film());
  app.use(catchErrors);


  app.listen(port, () => {
    console.log(`App started, listening on port ${port}`);
  });
};

export default runApp;
