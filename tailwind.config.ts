import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        qumail: {
          bg: '#0c1222',
          card: '#151d2e',
          accent: '#3b82f6',
          muted: '#94a3b8'
        }
      }
    }
  },
  plugins: []
};

export default config;
