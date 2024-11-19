/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        'poppy': {
          500: '#FF6F61',  // Light poppy color
          600: '#FF4D36',  // Darker poppy color for the date
          800: '#C84D31',  // Even darker for the title
        },
      },
    },
  },
  plugins: [],
};
