import type {
  NodeAtoms,
  NodeCreator,
} from '@/mdx/it-was-all-nand/Nand/model/type';
import { atom } from 'jotai';

export type BooleanAtoms = NodeAtoms<never, 'out', false>;

export const createBooleanAtoms: NodeCreator<BooleanAtoms> = () => {
  const outAtom = atom<boolean | null>(false);

  return {
    type: 'boolean',
    inputAtoms: {},
    outputAtoms: {
      out: outAtom,
    },
    effectAtom: undefined,
  };
};
