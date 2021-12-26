"use strict";

import dotenv from "dotenv";
import cors from "cors";
import express from "express";

import router from "./src/routes.js";

dotenv.config();
const app = express();

app.use(cors());

app.use("/v1/api", router);

app.listen(process.env.PORT, () => {
  // console.log(process.env.CTA_KEY);
  console.log("Server started on port", process.env.PORT);
});
