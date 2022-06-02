const client = require("./client");
const models = require("./models");

const DB_NAME = "CapstoneCommerceSite";

module.exports = {
  client,
  ...models,
};
