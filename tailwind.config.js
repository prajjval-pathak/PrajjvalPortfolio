/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          darkest: '#020c1b',
          DEFAULT: '#0a192f',
          card: '#112240',
          light: '#233554',
        },
        slate: {
          dark: '#495670',
          DEFAULT: '#8892b0',
          light: '#a8b2d1',
          lightest: '#ccd6f6',
        },
        teal: {
          DEFAULT: '#64ffda',
          tint: 'rgba(100, 255, 218, 0.1)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Calibre', 'San Francisco', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'SF Mono', 'Fira Mono', 'Roboto Mono', 'monospace'],
      },
      boxShadow: {
        'teal-glow': '0 0 25px rgba(100, 255, 218, 0.2)',
        'card': '0 10px 30px -15px rgba(2, 12, 27, 0.7)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}

