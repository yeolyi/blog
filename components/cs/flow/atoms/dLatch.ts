import { atom } from 'jotai';
import { atomEffect } from 'jotai-effect';
import { PROPAGATION_DELAY_MS } from '@/components/cs/flow/constants';
import type {
	NodeAtoms,
	NodeCreator,
	OutputAtom,
	OutputValue,
} from '@/components/cs/flow/model/type';

type DLatchAtoms = NodeAtoms<'d' | 'e', 'q' | 'qBar', true>;

export const createDLatchAtoms: NodeCreator<DLatchAtoms> = (initialValues) => {
	const dAtom = atom<OutputAtom | null>(null);
	const eAtom = atom<OutputAtom | null>(null);

	const qAtom = atom<OutputValue>(initialValues?.q ?? false);
	const qBarAtom = atom<OutputValue>(!(initialValues?.q ?? false));

	const effectAtom = atomEffect((get, set) => {
		const dInput = get(dAtom);
		const eInput = get(eAtom);
		if (dInput === null || eInput === null) return;

		const eValue = get(eInput);
		const dValue = get(dInput);
		if (dValue === null || eValue === null) return;

		if (!eValue) return;

		const timeoutId = setTimeout(() => {
			const currentQ = get(qAtom);
			if (currentQ !== dValue) {
				set(qAtom, dValue);
				set(qBarAtom, !dValue);
			}
		}, PROPAGATION_DELAY_MS);

		return () => clearTimeout(timeoutId);
	});

	return {
		type: 'dLatch' as const,
		inputAtoms: {
			d: dAtom,
			e: eAtom,
		},
		outputAtoms: {
			q: qAtom,
			qBar: qBarAtom,
		},
		effectAtom,
	};
};
