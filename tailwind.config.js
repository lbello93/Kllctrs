/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "space-grotesk": ["var(--font-space)"],
        "unica-one": ["var(--font-unica)"],
        inter: ["var(--font-inter)"],
      },
      colors: {
        navy: "#151E3C",
        cream: "#FEF9FF",
        amethyst: {
          50: "#F2EFFE",
          100: "#E5DFFD",
          200: "#CBBEFB",
          300: "#B39EF9",
          400: "#9C7CF7",
          500: "#8B5CF6",
          600: "#7729F1",
          700: "#5B18BE",
          800: "#400E8A",
          900: "#240554",
        },
        tuscan: {
          50: "#FFFCF8",
          100: "#FEF5E8",
          200: "#FDECD0",
          300: "#FDE2B4",
          400: "#FCDB9F",
          500: "#FCD279",
          600: "#FAC843",
          700: "#F0C040",
          800: "#9A7A26",
          900: "#4F3E0F",
        },
        bloom: {
          50: "#FDF4F5",
          100: "#FBEAEC",
          200: "#F7D0D6",
          300: "#F4BAC3",
          400: "#F19FAD",
          500: "#EF8799",
          600: "#ED6782",
          700: "#EB436D",
          800: "#A12847",
          900: "#571123",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
