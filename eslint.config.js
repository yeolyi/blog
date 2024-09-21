// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

// TODO: eslint 플러그인들 적용
export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
);
