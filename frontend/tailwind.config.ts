// frontend/tailwind.config.ts (UPDATED)

import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Required Font Color from PDF
        'text-primary': '#222222', 
        // Derived from Figma Sidebar/Accent
        'primary-dark': '#00244F', // Dark Navy for Sidebar
        'primary-blue': '#0A66C2', // Main Accent/Button Blue
        'accent-green': '#4CAF50', // Approved Status
        'accent-red': '#E53935',   // Rejected Status
        'accent-cyan': '#00BCD4',  // Under Review Status
        'sidebar-active': '#0D47A1', // A slightly different blue for active sidebar link
        'bg-light': '#FAFBFC',      // Very light background for content area
      },
      fontFamily: {
        // Fallbacks for Proxima Nova and Red Hat Display (Required by PDF)
        // NOTE: For the final, perfect design, Proxima Nova and Red Hat Display 
        // must be loaded locally as they are not Google Fonts. 
        // We will use a functional font stack here.
        sans: ['"Red Hat Display"', 'ui-sans-serif', 'system-ui'],
        body: ['"Proxima Nova"', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
};
export default config;