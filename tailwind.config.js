/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors:{
        deepLavender: '#8884d8',
        darkSlateBlue:"#7761A9",
        peralBrush:'#dededd',
      }
    },
  },
  plugins: [],
}

