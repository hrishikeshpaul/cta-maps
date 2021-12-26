"use strict";

import express from "express";
import { getPatterns, getRoutes, getVehicles, getPredictions } from "./util.js";

const router = express.Router();

router.get("/routes", async (req, res) => {
  try {
    let data = await getRoutes();
    
    data = data.map((item) => ({
      route: item.rt,
      name: item.rtnm,
      color: item.rtclr,
    }));

    res.send(data);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/vehicles", async (req, res) => {
  try {
    const data = await getVehicles(req.query.rt);

    res.send(data);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/patterns", async (req, res) => {
  try {
    const data = await getPatterns(req.query.rt);

    res.send(data);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/predictions", async (req, res) => {
  try {
    const data = await getPredictions(req.query.rt, req.query.stpid);

    res.send(data);
  } catch (err) {
    res.status(400).send(err);
  }
});

export default router;
