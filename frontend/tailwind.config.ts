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
        sans: ['Montserrat', 'sans-serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: '#55bab3',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#55bab3',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#e6f7f6',
          foreground: '#245f5a',
        },
        muted: {
          DEFAULT: '#f2fbfa',
          foreground: 'hsl(215.4 16.3% 46.9%)',
        },
        accent: {
          DEFAULT: '#d0efec',
          foreground: '#245f5a',
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
          DEFAULT: '#55bab3',
          foreground: '#f0faf8',
          primary: '#46a8a1',
          'primary-foreground': '#ffffff',
          accent: '#3e9b94',
          'accent-foreground': '#ffffff',
          border: '#3f8f89',
          ring: '#55bab3',
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
