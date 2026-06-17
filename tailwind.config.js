/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        composite: '#6366f1',
        condition: '#0ea5e9',
        action: '#10b981',
        root: '#f59e0b',
      },
    },
  },
  plugins: [],
};
