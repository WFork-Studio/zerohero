/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          500: "#6002BF;",
          800: "#00F0FF;",
        },
      },
    },
    fontFamily: {
      coolvetica: ["Coolvetica", "cursive"],
      coolveticaCondensed: ["Coolvetica-Condensed", "cursive"],
      coolveticaCrammed: ["Coolvetica-Crammed", "cursive"],
      roboto: ["Roboto", "sans-serif"],
    },
  },
  plugins: [],
};
