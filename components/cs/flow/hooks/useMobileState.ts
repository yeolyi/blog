import { useLayoutEffect, useState } from 'react';

export type TouchDeviceState =
	| {
			type: 'loading';
	  }
	| {
			type: 'desktop';
	  }
	| {
			type: 'mobile';
			value: boolean;
	  };

export const useTouchDeviceState = () => {
	const [state, setState] = useState<TouchDeviceState>({ type: 'loading' });

	useLayoutEffect(() => {
		if (typeof window === 'undefined') return;
		const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
		setState(isTouch ? { type: 'mobile', value: false } : { type: 'desktop' });
	}, []);

	return [state, setState] as const;
};
