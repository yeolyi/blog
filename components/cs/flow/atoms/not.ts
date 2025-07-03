import { atom } from 'jotai';
import { atomEffect } from 'jotai-effect';
import type {
	NodeAtoms,
	NodeCreator,
	OutputAtom,
	OutputValue,
} from '@/components/cs/flow/model/type';

type NotAtoms = NodeAtoms<'in1', 'out', true>;

export const createNotAtoms: NodeCreator<NotAtoms> = (initialValues) => {
	const in1Atom = atom<OutputAtom | null>(null);

	const notAtom = atom<boolean | null>((get) => {
		const in1 = get(in1Atom);

		if (in1 === null) {
			return null;
		}

		const in1Value = get(in1);

		return !in1Value;
	});

	const outAtom = atom<OutputValue>(initialValues?.out ?? null);

	const outEffect = atomEffect((get, set) => {
		const out = get(notAtom);

		const id = setTimeout(() => {
			set.recurse(outAtom, out);
		}, 200);

		return () => clearTimeout(id);
	});

	return {
		type: 'not' as const,
		inputAtoms: {
			in1: in1Atom,
		},
		outputAtoms: {
			out: outAtom,
		},
		effectAtom: outEffect,
	};
};
