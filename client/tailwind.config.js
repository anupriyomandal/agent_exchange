/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#534AB7',
          light: '#EEF0FF',
          dark: '#3D3590',
        },
        amber: {
          rating: '#BA7517',
        },
      },
    },
  },
  plugins: [],
};
