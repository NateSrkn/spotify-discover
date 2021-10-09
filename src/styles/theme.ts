interface Theme {
  background: string;
  textBase: string;
  colors: {
    [key: string]: string | { [key: number]: string };
  };
  fontFamily: typeof fontFamily;
  fontWeight: typeof fontWeight;
  fontSize: typeof fontSize;
  breakpoints: typeof breakpoints;
}

const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

const fontFamily = {
  sans: [
    "Satoshi Variable",
    "ui-sans-serif",
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    '"Segoe UI"',
    "Roboto",
    '"Helvetica Neue"',
    "Arial",
    '"Noto Sans"',
    "sans-serif",
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
    '"Noto Color Emoji"',
  ],
  serif: [
    "ui-serif",
    "Georgia",
    "Cambria",
    '"Times New Roman"',
    "Times",
    "serif",
  ],
  mono: [
    "ui-monospace",
    "SFMono-Regular",
    "Menlo",
    "Monaco",
    "Consolas",
    '"Liberation Mono"',
    '"Courier New"',
    "monospace",
  ],
};

const fontWeight = {
  thin: "100",
  extralight: "200",
  light: "300",
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  extrabold: "800",
  black: "900",
};

const fontSize = {
  xs: ["0.75rem", { lineHeight: "1rem" }],
  sm: ["0.875rem", { lineHeight: "1.25rem" }],
  base: ["1rem", { lineHeight: "1.5rem" }],
  lg: ["1.125rem", { lineHeight: "1.75rem" }],
  xl: ["1.25rem", { lineHeight: "1.75rem" }],
  "2xl": ["1.5rem", { lineHeight: "2rem" }],
  "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
  "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
  "5xl": ["3rem", { lineHeight: "1" }],
  "6xl": ["3.75rem", { lineHeight: "1" }],
  "7xl": ["4.5rem", { lineHeight: "1" }],
  "8xl": ["6rem", { lineHeight: "1" }],
  "9xl": ["8rem", { lineHeight: "1" }],
};

const colors = {
  white: "#fff",
  black: "#000",
  green: {
    900: "#111919",
  },
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
};

const light: Theme = {
  background: colors.gray[0],
  textBase: colors.black,
  colors,
  fontFamily,
  fontWeight,
  fontSize,
  breakpoints,
};

const dark: Theme = {
  background: colors.green[900],
  textBase: colors.gray[0],
  colors,
  fontFamily,
  fontWeight,
  fontSize,
  breakpoints,
};

const theme: { light: Theme; dark: Theme } = {
  light,
  dark,
};

export default theme;
