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
        territary : "#9915eb",
        primaryColor : "#0A0A0A" , 
        secondaryColor : "#1A1A1A"
      },
      fontFamily: {
        roboto: ['roboto', 'sans-serif'],
        poppins : ['poppins'  , 'sans-serif' ]
      },
      gridTemplateColumns: {
        14: "repeat(14, minmax(0, 1fr))", 
        16: "repeat(16, minmax(0, 1fr))", 
        18: "repeat(18, minmax(0, 1fr))", 


        
      },
      gridColumn: {
        'span-13': 'span 13 / span 13',
        'span-14': 'span 14 / span 14',
        'span-15': 'span 15 / span 15',
        'span-16': 'span 16 / span 16',
        'span-17': 'span 17 / span 17',
        'span-18': 'span 18 / span 18',

      } , 
      screens : {
        "ss"  : "350px",
        "tablet" : "1025px",
        '3xl' : '2100px'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out',
        slideUp: 'slideUp 0.4s ease-out',
      },
    },
  },
  plugins: [],
}

