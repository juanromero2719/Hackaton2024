/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      padding: {
        '50px': '50px',
      },
      colors: {
        coral: {
          DEFAULT: "#FF6F61",
          dark: "#E65B4F",
        },
        mint: {
          DEFAULT: "#38B2AC",
          light: "#56C7BF",
        },
        ivory: "#FFF9F2",
        darkBlue: "#2C3E50",
        charcoal: "#2D3748",
      },
    },
  },
  plugins: [],
}