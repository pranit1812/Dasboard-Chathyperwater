/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-navy': '#0F172A',
        'cyan': '#22D3EE',
        'blue': '#3B82F6',
        'purple': '#A855F7',
        'yellow': '#FACC15',
        'green': '#22C55E',
        'red': '#EF4444',
        'light-gray': '#E2E8F0',
        'sentiment': {
          'up': '#22C55E',    // Green
          'down': '#EF4444',  // Red
          'comment': '#FACC15' // Yellow
        }
      }
    },
  },
  plugins: [],
} 