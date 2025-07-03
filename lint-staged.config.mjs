export default {
	'*': ['biome check --no-errors-on-unmatched --files-ignore-unknown=true'],
	'*.mdx': ['prettier --write'],
	'**/*.ts?(x)': () => 'tsc -p tsconfig.json --noEmit',
};
