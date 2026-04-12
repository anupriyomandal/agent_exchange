/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#1B3C8C',
          light: '#E8EEF8',
          dark: '#122B66',
          50: '#F0F4FA',
          100: '#E8EEF8',
          500: '#1B3C8C',
          600: '#163275',
          700: '#122B66',
          800: '#0D1F4D',
        },
        amber: {
          rating: '#BA7517',
        },
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(27, 60, 140, 0.04), 0 1px 2px -1px rgba(27, 60, 140, 0.06)',
        'card-hover': '0 4px 12px 0 rgba(27, 60, 140, 0.1), 0 2px 4px -1px rgba(27, 60, 140, 0.06)',
      },
    },
  },
  plugins: [],
};
