import { atom } from 'jotai';
import { atomEffect } from 'jotai-effect';
import type {
	NodeAtoms,
	NodeCreator,
	OutputAtom,
	OutputValue,
} from '@/components/cs/flow/model/type';

type OrAtoms = NodeAtoms<'in1' | 'in2', 'out', true>;

export const createNorAtoms: NodeCreator<OrAtoms> = (initialValues) => {
	const in1Atom = atom<OutputAtom | null>(null);
	const in2Atom = atom<OutputAtom | null>(null);

	const orAtom = atom<boolean | null>((get) => {
		const in1 = get(in1Atom);
		const in2 = get(in2Atom);

		if (in1 === null || in2 === null) {
			return null;
		}

		const in1Value = get(in1);
		const in2Value = get(in2);

		return !(in1Value || in2Value);
	});

	const outAtom = atom<OutputValue>(initialValues?.out ?? null);

	const outEffect = atomEffect((get, set) => {
		const out = get(orAtom);

		const id = setTimeout(() => {
			set.recurse(outAtom, out);
		}, 200);

		return () => clearTimeout(id);
	});

	return {
		type: 'nor' as const,
		inputAtoms: {
			in1: in1Atom,
			in2: in2Atom,
		},
		outputAtoms: {
			out: outAtom,
		},
		effectAtom: outEffect,
	};
};
