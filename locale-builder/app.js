"use strict";

require("dotenv").config();

const { Translate } = require("@google-cloud/translate").v2;
const fs = require("fs");

const locales = ["es", "zh"];

const translate = new Translate({
  projectId: process.env.GOOGLE_PROJECT_ID,
  key: process.env.GOOGLE_API_KEY,
});

async function convert() {
  const englishLocaleJson = JSON.parse(fs.readFileSync("resources/en.json"));

  locales.forEach(async (locale) => {
    const output = {};
    const promises = [];

    Object.keys(englishLocaleJson).forEach((key) => {
      promises.push(translate.translate(englishLocaleJson[key], locale));
    });

    const response = await Promise.all(promises);

    Object.keys(englishLocaleJson).forEach((key, i) => {
      output[key] = response[i][0];
    });

    fs.writeFileSync(
      `resources/${locale}.json`,
      JSON.stringify(output, null, 2)
    );
  });
}

convert();
