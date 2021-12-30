"use strict";

require("dotenv").config();

const { Translate } = require("@google-cloud/translate").v2;

const translate = new Translate({
  projectId: process.env.GOOGLE_PROJECT_ID,
  key: process.env.GOOGLE_API_KEY,
});

async function quickStart() {
  const text = "Hello, world!";

  const target = "es";

  const [translation] = await translate.translate(text, target);
  console.log(`Text: ${text}`);
  console.log(`Translation: ${translation}`);
}

quickStart();
