/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // <--- important
  content: [
  './app/**/*.{js,ts,jsx,tsx}',
  './pages/**/*.{js,ts,jsx,tsx}',
  './components/**/*.{js,ts,jsx,tsx}',
  // Or if using `src` directory:
  './src/**/*.{js,ts,jsx,tsx}',
],
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.800'),
            a: {
              color: theme('colors.blue.600'),
              textDecoration: 'underline',
              '&:hover': {
                color: theme('colors.blue.800'),
              },
            },
            h1: {
              fontWeight: '700',
              fontSize: '2.25rem',
              color: theme('colors.gray.900'),
            },
            h2: {
              fontWeight: '600',
              fontSize: '1.5rem',
              color: theme('colors.gray.900'),
            },
            h3: {
              fontWeight: '500',
              fontSize: '1.25rem',
              color: theme('colors.gray.800'),
            },
            code: {
              backgroundColor: theme('colors.gray.100'),
              padding: '0.2rem 0.4rem',
              borderRadius: '0.25rem',
              color: theme('colors.pink.600'),
            },
            blockquote: {
              borderLeftColor: theme('colors.blue.400'),
              color: theme('colors.gray.600'),
              fontStyle: 'italic',
            },
          },
        },
        dark: {
          css: {
            color: theme('colors.gray.200'),
            a: { color: theme('colors.blue.400') },
            h1: { color: theme('colors.white') },
            h2: { color: theme('colors.gray.100') },
            h3: { color: theme('colors.gray.200') },
            code: {
              backgroundColor: theme('colors.gray.800'),
              color: theme('colors.green.400'),
            },
            blockquote: {
              borderLeftColor: theme('colors.blue.500'),
              color: theme('colors.gray.300'),
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};