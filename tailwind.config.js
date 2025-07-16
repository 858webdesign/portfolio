/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // <--- important
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
};
