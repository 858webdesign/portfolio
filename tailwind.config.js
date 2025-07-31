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
      keyframes: {
        dance: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        firework: {
          '0%': {
            opacity: 1,
            transform: 'translateY(0) scale(1)',
          },
          '100%': {
            opacity: 0,
            transform: 'translateY(-100px) scale(1.5)',
          },
        },
      },
      animation: {
        dance: 'dance 1s ease-in-out infinite',
        firework: 'firework 1s ease-out forwards',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
