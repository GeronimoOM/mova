/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'spacecadet-300': '#2e294e',
        'spacecadet-200': '#453d75',
        'spacecadet-100': '#5c529c',
        'coolgray-300': '#8789c0',
        'coolgray-200': '#a9abf0',
        'coolgray-100': '#cacdff',
        chilired: '#d64933',
        mint: '#59c9a5',
        alabaster: '#e0e2db',
        'charcoal-300': '#4b5267',
        'charcoal-200': '#5e6681',
        'charcoal-100': '#707b9a',
      },
      gridTemplateRows: {
        7: 'repeat(7, minmax(0, 1fr))',
      },
    },
  },
  plugins: [],
};
