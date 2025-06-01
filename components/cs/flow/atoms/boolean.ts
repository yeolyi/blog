import type {
  NodeAtoms,
  NodeCreator,
  OutputValue,
} from '@/components/cs/flow/model/type';
import { atom } from 'jotai';

type BooleanAtoms = NodeAtoms<never, 'out' | 'label', false>;

export const createBooleanAtoms: NodeCreator<BooleanAtoms> = (
  initialValues,
) => {
  const outAtom = atom<OutputValue>(initialValues?.out ?? false);
  const labelAtom = atom<OutputValue>(initialValues?.label ?? null);

  return {
    type: 'boolean',
    inputAtoms: {},
    outputAtoms: { out: outAtom, label: labelAtom },
    effectAtom: undefined,
  };
};
