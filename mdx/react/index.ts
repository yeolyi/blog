export const prepareOrder = ['setup', 'trigger-schedule-render-commit'];
export const initialRenderOreder = [
	'initial-render',
	'react-dom-is-simple',
	'initial-trigger',
	'fiber-traverse',
	'perform-unit-of-work',
	'begin-work-host-root',
	'begin-work-app',
	'complete-work',
	'initial-commit',
];
export const rerenderOrder = [
	'rerender',
	'rerender-trigger',
	'rerender-reuse',
	'compare-props',
	'child-always-rerenders',
	'rerender-fiber',
];

export const hookOrder = ['hook-dispatcher'];

export const order = [
	...prepareOrder,
	...initialRenderOreder,
	...rerenderOrder,
	...hookOrder,
];
