const {nextui} = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // ...
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    'node_modules/flowbite-react/lib/esm/**/*.js'
  ],
  theme: {
    extend: {},
  },
  plugins: [
    // require('flowbite/plugin'),
    nextui({
    themes: {
      light: {
        colors: {
          primary: {
            DEFAULT: "#55436F",
          },
          secondary: {
            DEFAULT: "#03637D",
          },
          danger: {
            DEFAULT: "#31283d",
          },
          tertiary: {
            DEFAULT: "#182253",
          },
          fourth: {
            DEFAULT: "#31283d",
          },
          lightSecondaryColor: {
            DEFAULT: "#D2D9DD",
          },
          focus: "#BEF264",
        },
      },
      dark: {
        layout: {},
        colors: {
          background: {
            50: "#F9F9F9",
            100: "#F3F3F3",
            200: "#EDEDED",
            300: "#E6E6E6",
            400: "#DEDEDE",
            500: "#D6D6D6",
            600: "#CFCFCF",
            700: "#C7C7C7",
            800: "#BFBFBF",
            900: "#B7B7B7",
            DEFAULT: "#232323",
          },
          primary: {
            DEFAULT: "#03637D",
          },
          secondary: {
            DEFAULT: "#55436F",
          },
          danger: {
            DEFAULT: "#31283d",
          },
          tertiary: {
            DEFAULT: "#182253",
          },
          fourth: {
            DEFAULT: "#31283d",
          },
          lightSecondaryColor: {
            DEFAULT: "#D2D9DD",
          },
          focus: "#BEF264",
        }, 
      },
    },
    
})],
};

