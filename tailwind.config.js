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
    },
  },
  plugins: [],
};
