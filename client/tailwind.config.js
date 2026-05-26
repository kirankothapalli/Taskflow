/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f1fa',
          100: '#e1e3f6',
          200: '#c8cbed',
          300: '#a3a9e0',
          400: '#7a82cf',
          500: '#5c64c0',
          600: '#484ea8',
          700: '#3a3f86',
          800: '#31356e',
          900: '#2a2d58',
          950: '#191b35',
        },
        surface: {
          DEFAULT: '#f4f5fa',
          dark: '#0e0f17',
          glass: 'rgba(255, 255, 255, 0.7)',
          darkGlass: 'rgba(14, 15, 23, 0.7)',
        },
        slate: {
          850: '#12131e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'card': '0 6px 0px -2px rgba(0, 0, 0, 0.05), inset 0 2px 0px 0px rgba(255, 255, 255, 0.6)',
        'card-hover': '0 10px 0px -2px rgba(0, 0, 0, 0.08), inset 0 2px 0px 0px rgba(255, 255, 255, 0.9)',
        'dark-card': '0 6px 0px -2px rgba(0, 0, 0, 0.4), inset 0 1px 0px 0px rgba(255, 255, 255, 0.05)',
        'dark-card-hover': '0 10px 0px -2px rgba(0, 0, 0, 0.6), inset 0 1px 0px 0px rgba(255, 255, 255, 0.1)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.04)',
        'dark-glass': '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
        'btn': '0 4px 0px 0px #3a3f86, inset 0 1px 0px 0px rgba(255,255,255,0.2)',
        'btn-hover': '0 6px 0px 0px #31356e, inset 0 1px 0px 0px rgba(255,255,255,0.3)',
        'btn-active': '0 0px 0px 0px #3a3f86, inset 0 1px 0px 0px rgba(255,255,255,0.1)',
        'glow': '0 0 20px rgba(92, 100, 192, 0.15)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'subtle-grid': 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M20 0H0v20h20V0z\' fill=\'%23f3f4f6\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
      }
    },
  },
  plugins: [],
};
