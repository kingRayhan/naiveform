import { fileURLToPath } from "node:url";
import path from "node:path";
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default [
  { ignores: ["node_modules", "dist"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.node,
      parserOptions: { project: "./tsconfig.json", tsconfigRootDir: __dirname },
    },
  },
];
