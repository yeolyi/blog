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
        firacode: ['var(--font-firacode)'],
        pretendard: ['var(--font-pretendard)'],
      },
      colors: {
        orange: '#E9390B',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
export default config;
