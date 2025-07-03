import { atom } from 'jotai';
import { atomEffect } from 'jotai-effect';
import { PROPAGATION_DELAY_MS } from '@/components/cs/flow/constants';
import type {
	NodeAtoms,
	NodeCreator,
	OutputAtom,
	OutputValue,
} from '@/components/cs/flow/model/type';

type FullAdderAtoms = NodeAtoms<'in1' | 'in2' | 'cin', 'sum' | 'cout', true>;

export const createFullAdderAtoms: NodeCreator<FullAdderAtoms> = (
	initialValues,
) => {
	const in1Atom = atom<OutputAtom | null>(null);
	const in2Atom = atom<OutputAtom | null>(null);
	const cinAtom = atom<OutputAtom | null>(null);

	const sumAtom = atom<boolean | null>((get) => {
		const in1 = get(in1Atom);
		const in2 = get(in2Atom);
		const cin = get(cinAtom);
		if (in1 === null || in2 === null || cin === null) return null;

		const in1Value = get(in1);
		const in2Value = get(in2);
		const cinValue = get(cin);
		if (in1Value === null || in2Value === null || cinValue === null) return null;

		return Boolean(Number(in1Value) ^ Number(in2Value) ^ Number(cinValue));
	});

	const coutAtom = atom<boolean | null>((get) => {
		const in1 = get(in1Atom);
		const in2 = get(in2Atom);
		const cin = get(cinAtom);
		if (in1 === null || in2 === null || cin === null) return null;

		const in1Value = get(in1);
		const in2Value = get(in2);
		const cinValue = get(cin);
		if (in1Value === null || in2Value === null || cinValue === null) return null;

		return Boolean(
			(in1Value && in2Value) || (in2Value && cinValue) || (cinValue && in1Value),
		);
	});

	const delayedSumAtom = atom<OutputValue>(initialValues?.sum ?? null);
	const delayedCoutAtom = atom<OutputValue>(initialValues?.cout ?? null);

	const outEffect = atomEffect((get, set) => {
		const sum = get(sumAtom);
		const cout = get(coutAtom);

		const id = setTimeout(() => {
			set.recurse(delayedSumAtom, sum);
			set.recurse(delayedCoutAtom, cout);
		}, PROPAGATION_DELAY_MS);

		return () => clearTimeout(id);
	});

	return {
		type: 'fullAdder' as const,
		inputAtoms: {
			in1: in1Atom,
			in2: in2Atom,
			cin: cinAtom,
		},
		outputAtoms: {
			sum: delayedSumAtom,
			cout: delayedCoutAtom,
		},
		effectAtom: outEffect,
	};
};
