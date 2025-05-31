/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Make sure this line includes jsx
  ],
  darkMode: 'class', // Enable dark mode via class
  theme: {
    extend: {},
  },
  plugins: [],
}