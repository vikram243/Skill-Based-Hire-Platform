// eslint.config.js
import js from "@eslint/js";
import globals from "globals";
import prettier from "eslint-config-prettier";
import pluginImport from "eslint-plugin-import";
import pluginPromise from "eslint-plugin-promise";
import pluginNode from "eslint-plugin-n";
import pluginSecurity from "eslint-plugin-security";

export default [
  js.configs.recommended,
  prettier, // disables conflicting rules for Prettier
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.es2023,
      },
    },
    plugins: {
      import: pluginImport,
      promise: pluginPromise,
      n: pluginNode,
      security: pluginSecurity,
    },
    rules: {
      // Core rules
      "no-console": "warn",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      eqeqeq: ["error", "always"],

      // Import plugin rules
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling", "index"],
          ],
          "newlines-between": "always",
        },
      ],

      // Node plugin rules
      "n/no-missing-import": "error",
      "n/no-unpublished-import": "off",

      // Promise plugin rules
      "promise/always-return": "off",
      "promise/no-nesting": "warn",
      "promise/no-promise-in-callback": "warn",

      // Security plugin rules
      "security/detect-object-injection": "off",
    },
  },
];