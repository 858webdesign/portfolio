/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // ✅ Includes all your app files
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'), // ✅ Enables `prose` class support
  ],
};