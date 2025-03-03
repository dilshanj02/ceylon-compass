const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", flowbite.content()],
  theme: {
    extend: {
      fontFamily: {
        outfit: ["outfit", "sans-serif"],
      },
    },
  },
  plugins: [require("daisyui"), flowbite.plugin()],
  daisyui: {
    themes: ["light"],
  },
};
