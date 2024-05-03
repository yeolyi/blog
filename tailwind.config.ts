import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            blockquote: {
              fontWeight: null,
              'p:first-of-type::before': { content: 'none' },
              'p:first-of-type::after': { content: 'none' },
            },
            h2: {
              'scroll-margin': '50px',
            },
            h3: {
              'scroll-margin': '50px',
            },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
