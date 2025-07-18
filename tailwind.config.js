/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        base: {
          bg: 'var(--color-bg)',
          text: 'var(--color-text)',
          accent: 'var(--color-accent)',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
