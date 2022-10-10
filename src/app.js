import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectToDatabase from "./configs/database.js";
import auth from "./routes/auth.routes.js";
import { catchErrors } from "./middlewares/errors.js";

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
  app.use(catchErrors);


  app.listen(port, () => {
    console.log(`App started, listening on port ${port}`);
  });
};

export default runApp;
