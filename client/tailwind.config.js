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
        'card': '0 1px 2px 0 rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.03)',
        'card-hover': '0 8px 24px 0 rgba(27,60,140,0.10), 0 1px 3px 0 rgba(27,60,140,0.06)',
        'elevated': '0 4px 16px 0 rgba(0,0,0,0.08), 0 1px 3px 0 rgba(0,0,0,0.04)',
      },
      letterSpacing: {
        tight: '-0.02em',
        tighter: '-0.03em',
      },
      backgroundImage: {
        'page-gradient': 'linear-gradient(160deg, #f8faff 0%, #f1f5fb 50%, #fafafa 100%)',
      },
    },
  },
  plugins: [],
};
