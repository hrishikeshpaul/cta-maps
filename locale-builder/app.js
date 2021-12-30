"use strict";

require("dotenv").config();

const { Translate } = require("@google-cloud/translate").v2;
const fs = require("fs");

const locales = ["es", "ch"];

const translate = new Translate({
  projectId: process.env.GOOGLE_PROJECT_ID,
  key: process.env.GOOGLE_API_KEY,
});

async function convert() {
  const text = "Hello, world!";

  const target = "zh";

  const [translation] = await translate.translate(text, target);
  console.log(`Text: ${text}`);
  console.log(`Translation: ${translation}`);
}

convert();
