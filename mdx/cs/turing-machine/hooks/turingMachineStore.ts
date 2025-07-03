import { create } from 'zustand';
import { createStoreContext } from '@/utils/store';

export type State = string;

export const INITIAL_STATE = 'q0';
export const EMPTY_TAPE_SYMBOL = '_';
export const HALT_STATE = 'q-halt';

export type TapeSymbol = string;
export type Direction = 'L' | 'R';

export type Rule = {
	newState: State;
	newSymbol: TapeSymbol;
	direction: Direction;
};

export type Rules = Record<State, Partial<Record<TapeSymbol, Rule>>>;

const parseRulesFromCSV = (csv: string): Rules => {
	const rules: Rules = {};
	const lines = csv
		.trim()
		.split('\n')
		.filter((line) => line.trim() !== '');

	for (const line of lines) {
		const parts = line.split(',').map((s) => s.trim());
		if (parts.length < 5) continue;
		const [currentState, readSymbol, newState, writeSymbol, direction] = parts;

		if (!rules[currentState]) {
			rules[currentState] = {};
		}
		rules[currentState][readSymbol] = {
			newState,
			newSymbol: writeSymbol,
			direction: direction as Direction,
		};
	}
	return rules;
};

type TuringMachineState = {
	tape: TapeSymbol[];
	headIdx: number;
	state: State;
	rules: Rules;
	isHalted: boolean;
};

type TuringMachineActions = {
	step: () => void;
	initialize: (
		rulesCsv: string,
		state: State,
		tape: TapeSymbol[],
		headIdx: number,
	) => void;
};

const turingMachineStore = () =>
	create<TuringMachineState & TuringMachineActions>((set, get) => ({
		tape: [],
		headIdx: 0,
		state: INITIAL_STATE,
		rules: {},
		isHalted: false,
		initialize: (rulesCsv, state, tape, headIdx) => {
			set({
				rules: parseRulesFromCSV(rulesCsv),
				tape,
				headIdx,
				state: state,
				isHalted: false,
			});
		},
		step: () => {
			const { state: currentState, headIdx, tape, rules } = get();

			if (currentState === HALT_STATE || headIdx < 0 || headIdx >= tape.length) {
				set({ isHalted: true });
				return;
			}

			const currentSymbol = tape[headIdx];
			const rule = rules[currentState]?.[currentSymbol];

			if (!rule) {
				set({ isHalted: true });
				return;
			}

			let newTape: TapeSymbol[];
			let nextHeadIdx: number;
			if (headIdx === 0 && rule.direction === 'L') {
				newTape = [EMPTY_TAPE_SYMBOL, ...tape];
				nextHeadIdx = 0;
			} else if (headIdx === tape.length - 1 && rule.direction === 'R') {
				newTape = [...tape, EMPTY_TAPE_SYMBOL];
				nextHeadIdx = tape.length;
			} else {
				newTape = [...tape];
				nextHeadIdx = headIdx + ({ L: -1, R: 1 }[rule.direction] ?? 0);
			}

			newTape[headIdx] = rule.newSymbol;
			set({
				tape: newTape,
				state: rule.newState,
				headIdx: nextHeadIdx,
			});
		},
	}));

export const [TuringMachineProvider, useTuringMachineStore] =
	createStoreContext(turingMachineStore);
