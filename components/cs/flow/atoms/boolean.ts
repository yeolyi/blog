import type {
  NodeAtoms,
  NodeCreator,
  OutputValue,
} from '@/components/cs/flow/model/type';
import { atom } from 'jotai';

type BooleanAtoms = NodeAtoms<never, 'out', false>;

export const createBooleanAtoms: NodeCreator<BooleanAtoms> = (
  initialValues,
) => {
  const outAtom = atom<OutputValue>(initialValues?.out ?? false);

  return {
    type: 'boolean',
    inputAtoms: {},
    outputAtoms: { out: outAtom },
    effectAtom: undefined,
  };
};
