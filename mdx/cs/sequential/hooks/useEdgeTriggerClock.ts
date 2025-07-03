'use client';

import { useCallback, useState } from 'react';

export function useEdgeTriggerClock() {
	const [clock, setClock] = useState(0);
	const [history, setHistory] = useState(() => [
		{ value: 0, timestamp: Date.now() },
	]);
	const [risingActive, setRisingActive] = useEdge();
	const [fallingActive, setFallingActive] = useEdge();

	const handlePointerDown = useCallback(() => {
		const now = Date.now();
		setClock(1);
		setHistory((h) => [...h, { value: 1, timestamp: now }]);
		setRisingActive(true);
	}, [setRisingActive]);

	const handlePointerUp = useCallback(() => {
		const now = Date.now();
		setClock(0);
		setHistory((h) => [...h, { value: 0, timestamp: now }]);
		setFallingActive(true);
	}, [setFallingActive]);

	return {
		clock,
		history,
		risingActive,
		fallingActive,
		handlePointerDown,
		handlePointerUp,
	};
}

const useEdge = () => {
	const [state, _setState] = useState(false);
	const setState = useCallback((value: boolean) => {
		_setState(value);
		setTimeout(() => _setState(false), 500);
	}, []);

	return [state, setState] as const;
};
