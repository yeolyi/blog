import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ['var(--font-pretendard)'],
        firacode: ['var(--font-firacode)'],
      },
      typography: {
        DEFAULT: {
          css: {
            blockquote: {
              fontWeight: null,
              'p:first-of-type::before': { content: 'none' },
              'p:first-of-type::after': { content: 'none' },
            },
            h2: {
              'scroll-margin': '100px',
            },
            h3: {
              'scroll-margin': '100px',
            },
            'code::before': { content: 'none' },
            'code::after': { content: 'none' },
            'li p': { margin: '0 !important' },
            p: { 'word-break': 'break-all' },
          },
        },
      },
      screens: {
        sm: '480px',
        md: '734px',
        lg: '1068px',
      },
      colors: {
        lightgray: '#f5f5f7',
        textblack: 'rgb(29,29,31)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
