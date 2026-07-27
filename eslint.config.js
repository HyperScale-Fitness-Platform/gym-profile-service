// eslint.config.js
const js = require("@eslint/js");

module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs", // or "module" if you're using ESM/import syntax
      globals: {
        require: "readonly",
        module: "readonly",
        process: "readonly",
        console: "readonly",
      },
    },
    rules: {
      // carry over any custom rules from your old .eslintrc here
    },
  },
];