"use strict";

import dotenv from "dotenv";
import chalk from "chalk";
import cors from "cors";
import express from "express";

import router from "./src/routes.js";

dotenv.config();
const app = express();

app.use(cors());

app.use("/v1/api", router);

if (process.env.CTA_KEY) {
  app.listen(process.env.PORT, () => {
    console.log("Server started on port", process.env.PORT);
  });
} else {
  console.log(chalk.red("CTA key missing. Failed to start server"));
}
