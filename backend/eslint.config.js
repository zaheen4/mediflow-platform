const js = require("@eslint/js");
const globals = require("globals");
const prettier = require("eslint-plugin-prettier");

module.exports = [
    js.configs.recommended,
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "commonjs",
            globals: {
                ...globals.node,
            },
        },
        plugins: {
            prettier,
        },
        rules: {
            "prettier/prettier": "warn",
            "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
            "no-console": "off",
        },
    },
];
