/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-ibm-plex-sans)'],
      },
      typography: {
        DEFAULT: {
          css: {
            pre: {
              borderRadius: '0',
              fontFamily: 'var(--font-monoplex-kr)',
            },
            '.highlighted': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              // tailwind typography 참고
              padding: '0 1.1428571em',
              margin: '0 -1.1428571em',
              width: 'calc(100% + 2.2857143em)',
              display: 'inline-block',
            },
            p: {
              wordBreak: 'keep-all',
            },
            h1: {
              wordBreak: 'keep-all',
            },
            h2: {
              scrollMarginTop: '10vh',
            },
            h3: {
              scrollMarginTop: '10vh',
            },
            'code::before': {
              content: 'none',
            },
            'code::after': {
              content: 'none',
            },
            code: {
              // backgroundColor: 'white',
              // color: 'black',
              fontWeight: 'inherit',
              // fontSize: 'inherit',
            },
            'code span': {
              whiteSpace: 'pre-wrap',
              wordBreak: 'keep-all',
            },
          },
        },
      },
    },
  },
};
