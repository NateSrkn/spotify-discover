const { spacing, fontFamily } = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");

/**
 * @typedef {import('tailwindcss/defaultConfig')}
 */
const config = {
  mode: "jit",
  purge: ["./src/pages/**/*.tsx", "./src/components/**/*.tsx"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "green-custom": "#414A4A",
        "pewter-blue": "#87A0B2",
        "faded-green": "#1E2828",
        gray: {
          0: "#fff",
          100: "#fafafa",
          200: "#eaeaea",
          300: "#999999",
          400: "#888888",
          500: "#666666",
          600: "#444444",
          700: "#333333",
          800: "#222222",
          900: "#111111",
        },
      },
      backgroundColor: (theme) => ({ ...theme("colors"), dark: "#111919" }),
      fontFamily: {
        sans: ["Satoshi", ...fontFamily.sans],
      },
    },
  },
  variants: {
    typography: ["dark"],
  },
  plugins: [
    plugin(({ addBase, theme }) => {
      addBase({
        h4: {
          fontSize: theme("fontSize.lg"),
          fontWeight: theme("fontWeight.medium"),
        },
      });
    }),
  ],
};

module.exports = config;
