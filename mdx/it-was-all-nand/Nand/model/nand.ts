import type {
  NodeAtoms,
  NodeCreator,
  OutputAtom,
} from '@/mdx/it-was-all-nand/Nand/model/type';
import { atom } from 'jotai';
import { atomEffect } from 'jotai-effect';

export type NandAtoms = NodeAtoms<'in1' | 'in2', 'out', true>;

export const createNandAtoms: NodeCreator<NandAtoms> = () => {
  const in1Atom = atom<OutputAtom | null>(null);
  const in2Atom = atom<OutputAtom | null>(null);

  const nandAtom = atom<boolean | null>((get) => {
    const in1 = get(in1Atom);
    const in2 = get(in2Atom);

    if (in1 === null || in2 === null) {
      return null;
    }

    const in1Value = get(in1);
    const in2Value = get(in2);

    return !(in1Value && in2Value);
  });

  const outAtom = atom<boolean | null>(null);

  const outEffect = atomEffect((get, set) => {
    const out = get(nandAtom);

    const id = setTimeout(() => {
      set.recurse(outAtom, out);
    }, 200);

    return () => clearTimeout(id);
  });

  return {
    type: 'nand' as const,
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
