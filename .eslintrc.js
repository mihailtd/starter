const { readFileSync } = require("fs");
const schemaString = readFileSync(`${__dirname}/schemas/schema.graphql`, "utf8");

module.exports = {
  parser: "@typescript-eslint/parser",
}
