import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import dbConfig from "./configs/database.config.js";
import auth from "./routes/auth.routes.js";
import watchable from "./routes/watchable.routes.js";
import storage from "./routes/storage.routes.js";
import { catchErrors } from "./middlewares/errors.js";
import serverConfig from "./configs/server.config.js";
import { initializeAdmin } from "./services/auth.service.js";

const runApp = async () => {
  console.log("Starting app...");
  await dbConfig.connectToDatabase();

  const app = express();

  const corsOptions = {
    origin: "http://localhost:4200",
  };

  app.use(cors(corsOptions));
  app.use(express.static("public"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use("/auth", auth());
  app.use("/watchables", watchable());
  app.use("/storage", storage());
  app.use(catchErrors);

  initializeAdmin();

  app.listen(serverConfig.port, () => {
    console.log(`App started, listening on port ${serverConfig.port}`);
  });
};

export default runApp;
