import type { NandNodeAtoms } from '@/mdx/it-was-all-nand/Nand/NandNode';
import type { NumberNodeAtoms } from '@/mdx/it-was-all-nand/Nand/NumberNode';
import { atom } from 'jotai';
import { atomEffect } from 'jotai-effect';

type AtomMap = Map<string, NumberNodeAtoms | NandNodeAtoms>;

export const createNandAtoms = (map: AtomMap) => {
  const in1Atom = atom<string | null>(null);
  const in2Atom = atom<string | null>(null);

  const immediateAtom = atom<boolean | null>((get) => {
    const in1 = get(in1Atom);
    const in2 = get(in2Atom);
    console.log('in1', in1, 'in2', in2);

    if (in1 === null || in2 === null) {
      return null;
    }

    const in1ValueAtom = map.get(in1)?.out;
    const in2ValueAtom = map.get(in2)?.out;

    if (in1ValueAtom === undefined || in2ValueAtom === undefined) {
      console.error('in1ValueAtom or in2ValueAtom is undefined');
      return null;
    }

    const in1Value = get(in1ValueAtom);
    const in2Value = get(in2ValueAtom);

    return !(in1Value && in2Value);
  });

  const outAtom = atom<boolean | null>(null);

  // flip flop등에서 사이클을 만든 것 같아도
  // effect로 연결되어있는거라서 사이클이 아니디.
  const outEffect = atomEffect((get, set) => {
    const out = get(immediateAtom);
    console.log('observe', out);

    const id = setTimeout(() => {
      set.recurse(outAtom, out);
    }, 200);

    return () => clearTimeout(id);
  });

  return {
    type: 'nand' as const,
    in1: in1Atom,
    in2: in2Atom,
    out: outAtom,
    outEffect,
  };
};

export const createNumberAtoms = (map: AtomMap) => {
  const outAtom = atom<boolean>(false);
  return {
    type: 'number' as const,
    out: outAtom,
  };
};
