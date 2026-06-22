import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Palette inspired by the MTN identity (yellow) and the health sector.
        marque: {
          jaune: '#ffcc00',
          sombre: '#1a1a1a',
          accent: '#0072ce',
        },
      },
    },
  },
  plugins: [],
};

export default config;
