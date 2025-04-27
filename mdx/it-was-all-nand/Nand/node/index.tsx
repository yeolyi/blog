import type { NandNodeAtoms } from '@/mdx/it-was-all-nand/Nand/node/NandNode';
import type { NumberNodeAtoms } from '@/mdx/it-was-all-nand/Nand/node/NumberNode';

export * from './NandNode';
export * from './NumberNode';

export type CustomNodeType = 'nand' | 'number';
export type CustomNodeAtoms = NandNodeAtoms | NumberNodeAtoms;

// 타입 가드 함수
export const isNandNodeAtoms = (
  atoms: CustomNodeAtoms,
): atoms is NandNodeAtoms => {
  return atoms.type === 'nand';
};

export const isNumberNodeAtoms = (
  atoms: CustomNodeAtoms,
): atoms is NumberNodeAtoms => {
  return atoms.type === 'number';
};
