/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        umber: '#45210E',
        ochre: '#F4BA17',
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      lineHeight: {
        'body': '1.5',
        'heading': '1.35',
      }
    },
  },
  plugins: [],
}
