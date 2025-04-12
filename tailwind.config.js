/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            pre: {
              borderRadius: "0",
              fontFamily: "var(--font-monoplex-kr)",
            },
            ".highlighted": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
            // tailwind typography 참고 
              padding: "0 1.1428571em",
              margin: "0 -1.1428571em",
              width: "calc(100% + 2.2857143em)",
              display: "inline-block",
            },
          },
        },
      },
    },
  },
};
