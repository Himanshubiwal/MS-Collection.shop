/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Didot', 'Georgia', 'serif'],
        sans: ['Outfit', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        balmoral: {
          black: '#000000',
          dark: '#0F172A',
          stone: '#D6D3C4',
          cream: '#FAF8F5',
          brown: '#4A3B32',
          purple: '#5A31F4', // The exact "Continue with shop" purple from Sign in page
          grey: '#F3F4F6',
          border: '#E5E7EB',
        },
      },
    },
  },
  plugins: [],
};
