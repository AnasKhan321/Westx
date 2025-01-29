/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors  : {
        primary: '#000000',
        secondary: 'white'  , 
        borderColor : "#2e2e2d"  , 
        territary : "#9915eb"
      }
    },
  },
  plugins: [],
}

