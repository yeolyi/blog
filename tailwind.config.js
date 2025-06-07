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
            '.line.diff.remove': {
              backgroundColor: 'rgba(248,81,73,0.3)',
              position: 'relative',
            },
            '.line.diff.remove::before': {
              position: 'absolute',
              height: '100%',
              lineHeight: '100%',
              top: 0,
              color: 'white',
              content: '"-"',
              fontSize: '1rem',
              left: '0.2em',
            },
            '.line.diff.add': {
              backgroundColor: '#2ea04326',
              position: 'relative',
            },
            '.line.diff.add::before': {
              position: 'absolute',
              height: '100%',
              lineHeight: '100%',
              top: 0,
              color: 'white',
              content: '"+"',
              fontSize: '1rem',
              left: '0.2em',
            },
            '*': {
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
              fontWeight: 'inherit',
            },
            'code span': {
              whiteSpace: 'pre-wrap',
              wordBreak: 'keep-all',
            },
            // 따옴표 제거
            'blockquote p:first-of-type::before': {
              content: 'none',
            },
            'blockquote p:last-of-type::after': {
              content: 'none',
            },
            'a:hover': {
              '-webkit-text-stroke': '0.4px currentColor',
            },
            summary: {
              '&:hover': {
                cursor: 'pointer',
              },
            },
            li: {
              overflowWrap: 'anywhere',
            },
          },
        },
      },
    },
  },
};
