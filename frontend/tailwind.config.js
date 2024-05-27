/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html", 
    "./src/**/*.{js,ts,jsx,tsx}", 
    "./node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
    "./node_modules/flowbite-react/lib/esm/**/*.js"],

  fontFamily: {
    noto: "'Noto Sans', 'sans-serif'",
    ABeeZee: "'ABeeZee', 'sans-serif'",
    Poppins: "'Poppins', 'sans-serif'",
  },

  theme: {
    colors: {
      // transparent: 'transparent',
      // current: 'currentColor',
      white: "#ffffff",
      black: "#000000",
      badge: "#F5EFE6",
      green: "#1A4D2E",
      "light-green": "#4F6F52",
      grey: "#4B514D",
      "light-grey": "#D9D9D9",
    },
    extend: {},
  },
  
  plugins: ['flowbite/plugin'],
};
