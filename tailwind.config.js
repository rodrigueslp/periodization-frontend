/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          'crossfit-blue': '#0d6efd',
          'crossfit-dark': '#0b5ed7',
          'crossfit-gray': '#f8f9fa',
        },
      },
    },
    plugins: [],
  }