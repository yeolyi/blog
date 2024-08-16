import path from 'node:path';
import { fileURLToPath } from 'node:url';

export default {};

/* https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/src/configs/eslint-recommended-raw.ts */

// export default tseslint.config({
//   extends: [
//     js.configs.recommended,
//     'plugin:@typescript-eslint/recommended',
//     eslintConfigPrettier,
//   ],
//   files: ['**/*.{ts,tsx}'],
//   ignores: ['dist', 'types/*'],
//   languageOptions: {
//     ecmaVersion: 2020,
//     globals: globals.browser,
//     parserOptions: {
//       project: ['./tsconfig.node.json', './tsconfig.app.json'],
//       tsconfigRootDir: import.meta.dirname,
//     },
//   },
//   settings: { react: { version: '18.3' } },
//   plugins: {
//     'react-hooks': reactHooks,
//     'react-refresh': reactRefresh,
//     'simple-import-sort': simpleImportSort,
//     react,
//   },
//   rules: {
//     ...reactHooks.configs.recommended.rules,
//     'react-refresh/only-export-components': [
//       'warn',
//       { allowConstantExport: true },
//     ],
//     'simple-import-sort/imports': 'error',
//     'simple-import-sort/exports': 'error',
//     ...react.configs.recommended.rules,
//     ...react.configs['jsx-runtime'].rules,
//     'prefer-const': 'off',
//   },
// });
