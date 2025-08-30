/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'baloo': ['Baloo 2', 'cursive'],
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        saffron: '#FF9933',
        'indian-green': '#138808',
        'brand-blue': '#1A73E8',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
      }
    },
  },
  plugins: [],
};
