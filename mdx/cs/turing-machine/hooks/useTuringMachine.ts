import { useCallback, useEffect, useState } from 'react';
import {
	INITIAL_STATE,
	type TapeSymbol,
	useTuringMachineStore,
} from './turingMachineStore';

export const useTuringMachine = (
	initialTape: TapeSymbol[],
	initialHeadIdx: number,
	rulesCsv: string,
) => {
	const { tape, headIdx, state, isHalted, step, initialize, rules } =
		useTuringMachineStore();
	const [isRunning, setIsRunning] = useState(false);

	const reset = useCallback(
		(newRulesCsv?: string) => {
			const bufferedTape = initialTape;
			initialize(
				newRulesCsv || rulesCsv,
				INITIAL_STATE,
				bufferedTape,
				initialHeadIdx,
			);
		},
		[initialize, initialTape, initialHeadIdx, rulesCsv],
	);

	useEffect(() => {
		reset();
	}, [reset]);

	useEffect(() => {
		if (!isRunning) return;

		const id = setInterval(() => {
			if (isHalted) {
				setIsRunning(false);
				clearInterval(id);
			} else {
				step();
			}
		}, 100);

		return () => clearInterval(id);
	}, [isHalted, isRunning, step]);

	const play = () => {
		if (!isHalted) {
			setIsRunning(true);
		}
	};

	const pause = () => {
		setIsRunning(false);
	};

	return {
		tape,
		headIdx: headIdx,
		state,
		isRunning,
		rules,
		isHalted,
		step,
		play,
		pause,
		reset,
	};
};
