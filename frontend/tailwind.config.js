/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width: {
        '90': '90%',
        '10': '10%'
      },
      height: {
        '90': '90%',
      }
    },
  },
  plugins: [],
}


