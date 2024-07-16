import * as eslint from 'eslint-linter-browserify';

const linter = new eslint.Linter();

export default function ESLintPlayground() {
  const messages = linter.verify(
    `
/* eslint yoda: "error" */
if ('red' === color) {
}
    `,
    {
      rules: {
        semi: ['error', 'never'],
      },
    },
    { filename: 'foo.js' },
  );

  console.log(messages);

  return 'HE';
}
