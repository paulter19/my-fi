/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#4A90E2',
        success: '#27AE60',
        danger: '#EB5757',
        warning: '#F2994A',
      },
    },
  },
  plugins: [],
}
