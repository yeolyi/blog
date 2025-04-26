import type { NandNodeAtoms } from '@/mdx/it-was-all-nand/Nand/node/NandNode';
import type { NumberNodeAtoms } from '@/mdx/it-was-all-nand/Nand/node/NumberNode';

export * from './NandNode';
export * from './NumberNode';

export type CustomNodeType = 'nand' | 'number';
export type CustomNodeAtoms = NandNodeAtoms | NumberNodeAtoms;
