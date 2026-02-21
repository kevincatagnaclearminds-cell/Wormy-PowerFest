
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        magenta: '#E91E8C',
        violet: '#7C3AED',
        yellow: '#FACC15',
        blue: '#3B82F6',   
        orange: '#F97316',  
        red: '#EF4444'
      },
      fontFamily: {
        sans: ['Sora', 'sans-serif'],
      },
      boxShadow: {
        'festival': '4px 4px 0px 0px rgba(0,0,0,1)',
        'festival-magenta': '4px 4px 0px 0px #E91E8C',
        'festival-violet': '4px 4px 0px 0px #7C3AED',
        'festival-yellow': '4px 4px 0px 0px #FACC15',
      }
    },
  },
  plugins: [],
}
