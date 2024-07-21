import js from '@eslint/js';

export default [
  {
    files: ['**/*.js'],
    rules: js.configs.recommended.rules,
  },
];
