export default {
	'*': [
		'biome check --no-errors-on-unmatched --files-ignore-unknown=true --write',
	],
	'**/*.ts?(x)': () => 'tsc -p tsconfig.json --noEmit',
};
