/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./templates/**/*.html",
    "./static/**/*.js",
    "./resume/**/*.py",
    "./user/**/*.py"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3952ff',
        secondary: '#f3f6fd',
      },
      fontFamily: {
        'sans': ['Arial', 'Helvetica', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

