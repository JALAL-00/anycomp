// frontend/tailwind.config.ts

import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'text-primary': '#222222',
        'primary-dark': '#00244F',
        'primary-blue': '#0A66C2',
        'accent-green': '#4CAF50',
        'accent-red': '#E53935',
        'accent-cyan': '#00BCD4',
        'sidebar-active': '#0D47A1',
        'bg-light': '#FAFBFC',
      },
      fontFamily: {
        sans: ['"Red Hat Display"', 'ui-sans-serif', 'system-ui'],
        body: ['"Inter"', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
};
export default config;