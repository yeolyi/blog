import { atom } from 'jotai';
import { atomEffect } from 'jotai-effect';
import { PROPAGATION_DELAY_MS } from '@/components/cs/flow/constants';
import type {
	NodeAtoms,
	NodeCreator,
	OutputAtom,
	OutputValue,
} from '@/components/cs/flow/model/type';

type HalfAdderAtoms = NodeAtoms<'in1' | 'in2', 'sum' | 'carry', true>;

export const createHalfAdderAtoms: NodeCreator<HalfAdderAtoms> = (
	initialValues,
) => {
	const in1Atom = atom<OutputAtom | null>(null);
	const in2Atom = atom<OutputAtom | null>(null);

	const sumAtom = atom<boolean | null>((get) => {
		const in1 = get(in1Atom);
		const in2 = get(in2Atom);
		if (in1 === null || in2 === null) return null;

		const in1Value = get(in1);
		const in2Value = get(in2);
		if (in1Value === null || in2Value === null) return null;

		return in1Value !== in2Value;
	});

	const carryAtom = atom<boolean | null>((get) => {
		const in1 = get(in1Atom);
		const in2 = get(in2Atom);
		if (in1 === null || in2 === null) return null;

		const in1Value = get(in1);
		const in2Value = get(in2);
		if (in1Value === null || in2Value === null) return null;

		return Boolean(in1Value && in2Value);
	});

	const delayedSumAtom = atom<OutputValue>(initialValues?.sum ?? null);
	const delayedCarryAtom = atom<OutputValue>(initialValues?.carry ?? null);

	const outEffect = atomEffect((get, set) => {
		const sum = get(sumAtom);
		const carry = get(carryAtom);

		const id = setTimeout(() => {
			set.recurse(delayedSumAtom, sum);
			set.recurse(delayedCarryAtom, carry);
		}, PROPAGATION_DELAY_MS);

		return () => clearTimeout(id);
	});

	return {
		type: 'halfAdder' as const,
		inputAtoms: {
			in1: in1Atom,
			in2: in2Atom,
		},
		outputAtoms: {
			sum: delayedSumAtom,
			carry: delayedCarryAtom,
		},
		effectAtom: outEffect,
	};
};
