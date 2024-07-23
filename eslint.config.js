import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { includeIgnoreFile } from '@eslint/compat';
import eslintConfigPrettier from 'eslint-config-prettier';
import reactPlugin from 'eslint-plugin-react';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, '.gitignore');

export default tseslint.config(
  // ignore
  includeIgnoreFile(gitignorePath),

  // globals
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.nodeBuiltin },
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
  },

  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },

  {
    ...reactPlugin.configs.flat.recommended,
    settings: { react: { version: 'detect' } },
    rules: {
      'react-in-jsx-scope': 'off',
    },
  },

  // configs
  tseslint.configs.base,
  {
    files: ['**/*.js', '**/*.ts', '**/*.tsx'],
    rules: {
      // Possible Problems error
      'array-callback-return': ['error', { checkForEach: true }],
      'for-direction': 'error',
      'no-async-promise-executor': 'error',
      'no-class-assign': 'error',
      'no-const-assign': 'error',
      'no-compare-neg-zero': 'error',
      'no-cond-assign': 'error',
      'no-constant-binary-expression': 'error',
      'no-constant-condition': 'error',
      'no-constructor-return': 'error',
      'no-control-regex': 'error',
      'no-debugger': 'error',
      'no-dupe-else-if': 'error',
      'no-duplicate-case': 'error',
      'no-duplicate-imports': 'error',
      'no-empty-character-class': 'error',
      'no-empty-pattern': 'error',
      'no-ex-assign': 'error',
      'no-fallthrough': ['error', { reportUnusedFallthroughComment: true }],
      'no-import-assign': 'error',
      'no-invalid-regexp': 'error',
      'no-irregular-whitespace': 'error',
      'no-loss-of-precision': 'error',
      'no-misleading-character-class': 'error',
      'no-new-native-nonconstructor': 'error',
      'no-promise-executor-return': 'error',
      'no-prototype-builtins': 'error',
      'no-self-assign': 'error',
      'no-self-compare': 'error',
      'no-sparse-arrays': 'error',
      'no-unexpected-multiline': 'error',
      'no-unreachable-loop': 'error',
      'no-unsafe-finally': 'error',
      'no-unsafe-optional-chaining': [
        'error',
        { disallowArithmeticOperators: true },
      ],
      'no-unused-private-class-members': 'error',
      'no-useless-assignment': 'error',
      'no-useless-backreference': 'error',
      'require-atomic-updates': 'error',
      'use-isnan': ['error', { enforceForIndexOf: true }],

      // Possible Problems warn
      'no-await-in-loop': 'warn',
      'no-template-curly-in-string': 'warn',

      // Suggestion error
      'accessor-pairs': 'error',
      // useEffect에서 애매함
      // 'consistent-return': 'error',
      'consistent-this': 'error',
      'default-case-last': 'error',
      'default-param-last': 'error',
      'dot-notation': 'error',
      eqeqeq: 'error',
      'grouped-accessor-pairs': ['error', 'getBeforeSet'],
      'init-declarations': ['error', 'always'],
      'logical-assignment-operators': ['error', 'always'],
      // Fira_Code에서 터짐
      // 'new-cap': 'error',
      'no-alert': 'error',
      'no-array-constructor': 'error',
      'no-caller': 'error',
      'no-case-declarations': 'error',
      'no-empty': 'error',
      'no-empty-function': 'error',
      'no-empty-static-block': 'error',
      'no-extend-native': 'error',
      'no-extra-bind': 'error',
      'no-extra-boolean-cast': ['error', { enforceForInnerExpressions: true }],
      'no-extra-label': 'error',
      'no-global-assign': 'error',
      'no-implicit-coercion': 'error',
      'no-implied-eval': 'error',
      'no-label-var': 'error',
      'no-lone-blocks': 'error',
      'no-lonely-if': 'error',
      'no-loop-func': 'error',
      // 'no-nested-ternary': 'error',
      'no-new-wrappers': 'error',
      'no-object-constructor': 'error',
      'no-octal': 'error',
      'no-octal-escape': 'error',
      'no-proto': 'error',
      'no-regex-spaces': 'error',
      'no-return-assign': 'error',
      'no-script-url': 'error',
      'no-restricted-syntax': ['error', 'SequenceExpression'],
      'no-shadow-restricted-names': 'error',
      'no-throw-literal': 'error',
      'no-unneeded-ternary': 'error',
      'no-unused-expressions': ['error', { enforceForJSX: true }],
      'no-unused-labels': 'error',
      'no-useless-call': 'error',
      'no-useless-catch': 'error',
      'no-useless-computed-key': 'error',
      'no-useless-concat': 'error',
      'no-useless-constructor': 'error',
      'no-useless-escape': 'error',
      'no-useless-rename': 'error',
      'no-useless-return': 'error',
      'no-var': 'error',
      'no-void': 'error',
      'no-with': 'error',
      'object-shorthand': 'error',
      'operator-assignment': 'error',
      'prefer-exponentiation-operator': 'error',
      'prefer-named-capture-group': 'error',
      'prefer-numeric-literals': 'error',
      'prefer-object-has-own': 'error',
      'prefer-object-spread': 'error',
      'prefer-promise-reject-errors': 'error',
      'prefer-regex-literals': ['error', { disallowRedundantWrapping: true }],
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',
      'prefer-template': 'error',
      // 자동 정렬 안됨
      // 'sort-imports': 'error',
      'symbol-description': 'error',
      yoda: ['error', 'never', { exceptRange: true }],

      // Suggestion warn
      'class-methods-use-this': 'warn',
      complexity: 'warn',
      'max-classes-per-file': ['warn'],
      'max-depth': ['warn'],
      'max-lines': ['warn', 200],
      'max-lines-per-function': ['warn', { max: 50, IIFEs: true }],
      'max-params': ['warn', 3],
      'no-console': 'warn',

      // typescript
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: 'notUnused',
          // reportUsedIgnorePattern: true,
          ignoreRestSiblings: true,
        },
      ],
    },
  },

  eslintConfigPrettier,
);

/* https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/src/configs/eslint-recommended-raw.ts */
