export default {
  '*': [
    'biome check --write --no-errors-on-unmatched --files-ignore-unknown=true',
  ],
  '*.mdx': ['prettier --write'],
  '**/*.ts?(x)': () => 'tsc -p tsconfig.json --noEmit',
};
