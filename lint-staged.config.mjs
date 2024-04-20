const config = {
  '*.{js,ts,tsx}': 'eslint --cache --fix',
  '*.{js,ts,tsx,css,md,mdx}': 'prettier --write',
  '*.{ts,tsx}': () => 'tsc --noEmit',
};

export default config;
