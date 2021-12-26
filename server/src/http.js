import axios from "axios";
import chalk from "chalk";
import dotenv from "dotenv";

dotenv.config();

export const Http = axios.create({
  baseURL: process.env.CTA_BASE_URL,
  params: {
    key: process.env.CTA_KEY,
    format: "json",
  },
});

Http.interceptors.request.use((config) => {
  const { baseURL, params, url } = config;
  const paramsStr = Object.keys(params)
    .map((key) => key + "=" + params[key])
    .join("&");

  console.log(chalk.blue(`[GET] ${baseURL}${url}?${paramsStr}`));

  return config;
});

Http.interceptors.response.use((response) => {
  const { data } = response;
  const busResponse = data["bustime-response"];
  const error = busResponse["error"];

  if (error) {
    console.log(chalk.red(error[0].msg));

    return { error: error[0].msg };
  }

  return { data: busResponse };
});
