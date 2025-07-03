import { atom } from 'jotai';
import { atomEffect } from 'jotai-effect';
import { PROPAGATION_DELAY_MS } from '@/components/cs/flow/constants';
import type {
	NodeAtoms,
	NodeCreator,
	OutputAtom,
	OutputValue,
} from '@/components/cs/flow/model/type';

type AndAtoms = NodeAtoms<'in1' | 'in2', 'out', true>;

export const createAndAtoms: NodeCreator<AndAtoms> = (initialValues) => {
	const in1Atom = atom<OutputAtom | null>(null);
	const in2Atom = atom<OutputAtom | null>(null);

	const nandAtom = atom<boolean | null>((get) => {
		const in1 = get(in1Atom);
		const in2 = get(in2Atom);
		if (in1 === null || in2 === null) return null;

		const in1Value = get(in1);
		const in2Value = get(in2);

		// input 하나가 null인걸 의도적을 허용
		// 이를 통해 피드백 구조를 허용
		return Boolean(in1Value && in2Value);
	});

	const outAtom = atom<OutputValue>(initialValues?.out ?? null);

	const outEffect = atomEffect((get, set) => {
		const out = get(nandAtom);

		const id = setTimeout(() => {
			set.recurse(outAtom, out);
		}, PROPAGATION_DELAY_MS);

		return () => clearTimeout(id);
	});

	return {
		type: 'and' as const,
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
