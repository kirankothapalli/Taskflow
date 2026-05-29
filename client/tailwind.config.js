/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        surface: {
          DEFAULT: '#ffffff',
          dark: '#0e0f17',
          glass: 'rgba(255, 255, 255, 0.8)',
          darkGlass: 'rgba(14, 15, 23, 0.8)',
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
        'subtle': '0 2px 10px rgba(0, 0, 0, 0.02)',
        'card': '0 10px 40px -10px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0,0,0,0.03)',
        'card-hover': '0 20px 50px -12px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0,0,0,0.04)',
        'dark-card': '0 10px 40px -10px rgba(0, 0, 0, 0.4), inset 0 1px 0px 0px rgba(255, 255, 255, 0.05)',
        'dark-card-hover': '0 20px 50px -12px rgba(0, 0, 0, 0.6), inset 0 1px 0px 0px rgba(255, 255, 255, 0.1)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.05)',
        'dark-glass': '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
        'btn': '0 4px 14px 0 rgba(92, 100, 192, 0.39)',
        'btn-hover': '0 6px 20px rgba(92, 100, 192, 0.23)',
        'btn-secondary': '0 4px 14px 0 rgba(0, 0, 0, 0.05)',
        'glow': '0 0 20px rgba(92, 100, 192, 0.15)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'mesh-light': 'radial-gradient(at 0% 0%, rgba(240, 241, 250, 1) 0, transparent 50%), radial-gradient(at 100% 0%, rgba(225, 227, 246, 1) 0, transparent 50%), radial-gradient(at 100% 100%, rgba(200, 203, 237, 0.5) 0, transparent 50%), radial-gradient(at 0% 100%, rgba(255, 255, 255, 1) 0, transparent 50%)',
        'subtle-grid': 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M20 0H0v20h20V0z\' fill=\'%23f3f4f6\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
      },
      animation: {
        blob: "blob 7s infinite",
        tilt: "tilt 10s infinite linear",
      },
      keyframes: {
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" }
        },
        tilt: {
          "0%, 50%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(1deg)" },
          "75%": { transform: "rotate(-1deg)" },
        }
      }
    },
  },
  plugins: [],
};
