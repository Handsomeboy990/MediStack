import type { Config } from 'tailwindcss';
import tailwindcssAnimate from 'tailwindcss-animate';

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-montserrat)', 'Montserrat', 'sans-serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: '#004D40',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#004D40',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#e6f2f0',
          foreground: '#003830',
        },
        muted: {
          DEFAULT: '#f2f7f6',
          foreground: 'hsl(215.4 16.3% 46.9%)',
        },
        accent: {
          DEFAULT: '#d0e9e5',
          foreground: '#003830',
        },
        destructive: {
          DEFAULT: 'hsl(0 84.2% 60.2%)',
          foreground: 'hsl(210 40% 98%)',
        },
        card: {
          DEFAULT: '#ffffff',
          foreground: 'hsl(222.2 84% 4.9%)',
        },
        popover: {
          DEFAULT: '#ffffff',
          foreground: 'hsl(222.2 84% 4.9%)',
        },
        sidebar: {
          DEFAULT: '#004D40',
          foreground: '#f0faf8',
          primary: '#006B5A',
          'primary-foreground': '#ffffff',
          accent: '#005f4e',
          'accent-foreground': '#ffffff',
          border: '#00382e',
          ring: '#33b59a',
        },
        marque: {
          jaune: '#ffcc00',
          sombre: '#1a1a1a',
          accent: '#004D40',
        },
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
