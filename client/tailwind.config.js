/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        spacecadet: '#2e294e',
        rosequartz: '#b79fad',
        chilired: '#d64933',
        mint: '#59c9a5',
        lavender: '#f8e9e9',
        'charcoal-300': '#4b5267',
        'charcoal-200': '#5e6681',
        'charcoal-100': '#707b9a',
      }
    },
  },
  plugins: [],
}

