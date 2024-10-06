import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./client/**/*.{html,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        firacode: ['firacode'],
      },
      typography: {
        DEFAULT: {
          css: {
            blockquote: {
              fontWeight: null,
              'p:first-of-type::before': { content: 'none' },
              'p:first-of-type::after': { content: 'none' },
              borderInlineStartWidth: '3px',
              color: '#999',
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
            p: { 'overflow-wrap': 'break-word' },
            td: {
              overflowWrap: 'anywhere',
            },
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
  plugins: [typography],
};
