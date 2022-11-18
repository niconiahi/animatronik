/**
 * @type {import('@types/eslint').Linter.BaseConfig}
 */
module.exports = {
  extends: [
    "@remix-run/eslint-config",
    "@remix-run/eslint-config/node",
    "@remix-run/eslint-config/jest-testing-library",
    "prettier",
    "plugin:prettier/recommended",
  ],
  // We're using vitest which has a very similar API to jest
  // (so the linting plugins work nicely), but we have to
  // set the jest version explicitly.
  settings: {
    jest: {
      version: 27,
    },
  },
  rules: {
    camelcase: "error",
    "use-isnan": "error",
    "no-unreachable": "error",
    "import/no-unresolved": "off",
    "newline-before-return": "error",
    "no-useless-computed-key": "error",
    eqeqeq: [
      "error",
      "always",
      {
        null: "ignore",
      },
    ],
    "one-var": [
      "error",
      {
        initialized: "never",
      },
    ],
    "prefer-destructuring": [
      "error",
      {
        array: true,
        object: true,
      },
      {
        enforceForRenamedProperties: false,
      },
    ],
    "padding-line-between-statements": [
      "error",
      {
        blankLine: "always",
        prev: "*",
        next: "return",
      },
      {
        blankLine: "always",
        prev: "multiline-block-like",
        next: "if",
      },
      {
        blankLine: "always",
        prev: "multiline-block-like",
        next: "expression",
      },
      {
        blankLine: "always",
        prev: "const",
        next: "if",
      },
    ],
  },
};
