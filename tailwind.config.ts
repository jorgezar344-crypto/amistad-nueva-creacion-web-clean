import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        void: '#06090E',
        surface: {
          DEFAULT: '#0D141F',
          elevated: '#152030',
          border: 'rgba(0, 229, 255, 0.14)',
        },
        cyan: {
          electric: '#00E5FF',
          core: '#00C2D1',
          deep: '#006B7B',
          glow: 'rgba(0, 229, 255, 0.3)',
        },
        teal: {
          dark: '#003842',
          deep: '#004F63',
        },
        brandText: {
          primary: '#FFFFFF',
          secondary: '#94A3B8',
          muted: '#64748B',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        cyanGlow: '0 0 25px rgba(0, 229, 255, 0.25)',
        cyanGlowLg: '0 0 50px rgba(0, 229, 255, 0.35)',
        cardGlow: '0 8px 32px 0 rgba(0, 0, 0, 0.37), 0 0 1px 1px rgba(0, 229, 255, 0.15)',
      },
      animation: {
        'pulse-subtle': 'pulseGlow 4s ease-in-out infinite',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.03)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
