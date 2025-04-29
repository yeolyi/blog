import type {
  NodeAtoms,
  NodeCreator,
} from '@/app/[locale]/components/Nand/model/type';
import { atom } from 'jotai';

export type BooleanAtoms = NodeAtoms<never, 'out', false>;

export const createBooleanAtoms: NodeCreator<BooleanAtoms> = (
  initialValues,
) => {
  const outAtom = atom<boolean | null>(initialValues?.out ?? false);

  return {
    type: 'boolean',
    inputAtoms: {},
    outputAtoms: {
      out: outAtom,
    },
    effectAtom: undefined,
  };
};
