const defaultTheme = require("tailwindcss/defaultTheme");

/**
 * @typedef {import('tailwindcss/defaultConfig')}
 */
const config = {
  mode: "jit",
  content: ["./src/pages_old/**/*.tsx", "./src/components/**/*.tsx", "./src/app/**/*.tsx"],
  darkMode: "class",
  theme: {
    fontFamily: {
      sans: ["Satoshi", ...defaultTheme.fontFamily.sans],
      mono: ["Space Mono", ...defaultTheme.fontFamily.mono],
    },
    extend: {
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": {
            opacity: 0,
          },
          "100%": {
            opacity: 1,
          },
        },
      },
      colors: {
        "primary-green": "#1E2828",
        "secondary-green": "#414A4A",
        "pewter-blue": "#87A0B2",
        "spotify-green": "#1ED760",
      },
      backgroundColor: (theme) => ({ ...theme("colors"), dark: "#111919" }),
    },
  },
  plugins: [],
};

module.exports = config;
