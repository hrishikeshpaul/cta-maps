"use strict";

import { Http } from "./http.js";

export const getRoutes = async () => {
  const { data, error } = await Http.get(`/getroutes`);

  if (error) {
    throw error;
  }

  return data["routes"];
};

export const getVehicles = async (routes) => {
  const { data, error } = await Http.get("/getvehicles", {
    params: { rt: routes },
  });

  if (error) {
    throw error;
  }

  return data["vehicle"];
};

export const getPatterns = async (route) => {
  const { data, error } = await Http.get("/getpatterns", {
    params: { rt: route },
  });

  if (error) {
    throw error;
  }

  return data["ptr"];
};

export const getPredictions = async (route, stop) => {
  const { data, error } = await Http.get("/getpredictions", {
    params: { rt: route, stpid: stop },
  });

  if (error) {
    throw error;
  }

  return data["prd"];
};
