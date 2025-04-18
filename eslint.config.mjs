import { defineConfig } from "eslint/config";
import jsxA11Y from "eslint-plugin-jsx-a11y";
import tanstack from "@tanstack/eslint-plugin-query";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

export default defineConfig([
  ...tanstack.configs["flat/recommended"],
  {
    plugins: {
      "jsx-a11y": jsxA11Y,
    },
  },
  ...compat.config({
    extends: ["next", "next/core-web-vitals", "next/typescript"],
    rules: {
      "@next/next/no-img-element": "off",
    },
  }),
]);
