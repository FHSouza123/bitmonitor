/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 1s ease-out',
        'pulse': 'pulse 3s ease-in-out infinite',
        'shine': 'shine 2s linear infinite',
        'scroll-fast': 'scroll 30s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulse: {
          '0%': { 
            opacity: '0.9', 
            transform: 'scale(0.98)',
            filter: 'drop-shadow(0 0 5px rgba(247, 147, 26, 0.3))'
          },
          '50%': { 
            opacity: '1', 
            transform: 'scale(1.02)',
            filter: 'drop-shadow(0 0 15px rgba(247, 147, 26, 0.6))'
          },
          '100%': { 
            opacity: '0.9', 
            transform: 'scale(0.98)',
            filter: 'drop-shadow(0 0 5px rgba(247, 147, 26, 0.3))'
          },
        },
        shine: {
          '0%': { 
            backgroundPosition: '200% center',
            opacity: '0.5'
          },
          '100%': { 
            backgroundPosition: '-200% center',
            opacity: '1'
          },
        },
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      minHeight: {
        'screen-75': '75vh',
        'screen-85': '85vh',
      },
      fontSize: {
        'xxs': '0.625rem',
      },
      colors: {
        'bitcoin': {
          DEFAULT: '#f7931a',
          '50': '#fff7eb',
          '100': '#ffecd2',
          '200': '#ffd5a3',
          '300': '#ffb86b',
          '400': '#ff8f2e',
          '500': '#f7931a',
          '600': '#e67008',
          '700': '#bf5309',
          '800': '#994210',
          '900': '#7c3711',
        },
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [],
} 