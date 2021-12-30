'use strict';

require('dotenv').config()
const { Translate } = require("@google-cloud/translate").v2;

const projectId = "loco-330103";

const translate = new Translate({
  projectId,
  key: "AIzaSyCVcZkyBlNCIdwz7Kzc3EIJSDzGv9uwwZ8",
});

async function quickStart() {
  const text = "Hello, world!";

  const target = "es";

  const [translation] = await translate.translate(text, target);
  console.log(`Text: ${text}`);
  console.log(`Translation: ${translation}`);
}

quickStart();
