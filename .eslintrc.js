const { readFileSync } = require("fs")
const schemaString = readFileSync(`${__dirname}/schemas/schema.graphql`, "utf8")

module.exports = {
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    sourceType: "module",
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    "plugin:import/errors",
    "plugin:import/typescript",
    "prettier",
  ],
  plugins: [
    "vue",
    "jest",
    "@typescript-eslint",
    "graphql",
    "simple-import-sort",
    "import",
    "prettier",
  ],
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  rules: {
    "no-unused-vars": "off",
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    "graphql/template-strings": [
      "error",
      {
        env: "literal",
        schemaString,
        tagName: "gql",
        validators: [
          "ExecutableDefinitionsRule",
          "FieldsOnCorrectTypeRule",
          "FragmentsOnCompositeTypesRule",
          "KnownArgumentNamesRule",
          "KnownDirectivesRule", // disabled by default in relay
          // "KnownFragmentNamesRule", // disabled by default in all envs
          "KnownTypeNamesRule",
          "LoneAnonymousOperationRule",
          "NoFragmentCyclesRule",
          "NoUndefinedVariablesRule", //disabled by default in relay
          // "NoUnusedFragmentsRule" // disabled by default in all envs
          // "NoUnusedVariablesRule" throws even when fragments use the variable
          "OverlappingFieldsCanBeMergedRule",
          "PossibleFragmentSpreadsRule",
          "ProvidedRequiredArgumentsRule", // disabled by default in relay
          "ScalarLeafsRule", // disabled by default in relay
          "SingleFieldSubscriptionsRule",
          "UniqueArgumentNamesRule",
          "UniqueDirectivesPerLocationRule",
          "UniqueFragmentNamesRule",
          "UniqueInputFieldNamesRule",
          "UniqueOperationNamesRule",
          "UniqueVariableNamesRule",
          "ValuesOfCorrectTypeRule",
          "VariablesAreInputTypesRule",
          // "VariablesDefaultValueAllowedRule",
          "VariablesInAllowedPositionRule",
        ],
      },
    ],
    "graphql/named-operations": [
      "error",
      {
        env: "literal",
        schemaString,
        tagName: "gql",
      },
    ],
    "graphql/required-fields": [
      "error",
      {
        env: "literal",
        schemaString,
        tagName: "gql",
        requiredFields: ["nodeId", "id"],
      },
    ],
  },
}
