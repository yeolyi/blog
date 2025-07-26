import { atom } from 'jotai';
import { atomEffect } from 'jotai-effect';
import { PROPAGATION_DELAY_MS } from '@/components/cs/flow/constants';
import type {
	NodeAtoms,
	NodeCreator,
	OutputAtom,
	OutputValue,
} from '@/components/cs/flow/model/type';

type LabelAtoms = NodeAtoms<'in', 'label' | 'out', true>;

export const createLabelAtoms: NodeCreator<LabelAtoms> = (initialValues) => {
	const inAtom = atom<OutputAtom | null>(null);

	const labelAtom = atom<OutputValue | null>(initialValues?.label ?? null);
	const outAtom = atom<OutputValue | null>(initialValues?.out ?? null);

	const outEffect = atomEffect((get, set) => {
		const in1 = get(inAtom);
		if (in1 === null) return;

		const in1Value = get(in1);

		const id = setTimeout(() => {
			set.recurse(outAtom, in1Value);
		}, PROPAGATION_DELAY_MS);

		return () => clearTimeout(id);
	});

	return {
		type: 'label' as const,
		inputAtoms: {
			in: inAtom,
		},
		outputAtoms: {
			label: labelAtom,
			out: outAtom,
		},
		effectAtom: outEffect,
	};
};
