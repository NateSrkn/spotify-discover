const { fontFamily } = require("tailwindcss/defaultTheme");

/**
 * @typedef {import('tailwindcss/defaultConfig')}
 */
const config = {
  mode: "jit",
  purge: ["./src/pages/**/*.tsx", "./src/components/**/*.tsx"],
  darkMode: "class",
  theme: {
    fontFamily: {
      sans: ["Satoshi", ...fontFamily.sans],
    },
    extend: {
      colors: {
        "green-custom": "#414A4A",
        "pewter-blue": "#87A0B2",
        "faded-green": "#1E2828",
        "spotify-green": "#1ED760",
      },
      backgroundColor: (theme) => ({ ...theme("colors"), dark: "#111919" }),
    },
  },
};

module.exports = config;
