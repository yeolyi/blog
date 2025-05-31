import { createFullAdderAtoms } from '@/components/cs/flow/atoms/fullAdder';
import { createHalfAdderAtoms } from '@/components/cs/flow/atoms/halfAdder';
import { createNandAtoms } from '@/components/cs/flow/atoms/nand';
import { createOrAtoms } from '@/components/cs/flow/atoms/or';
import { createBooleanAtoms } from './boolean';

export const registry = {
  number: createBooleanAtoms,
  nand: createNandAtoms,
  halfAdder: createHalfAdderAtoms,
  or: createOrAtoms,
  fullAdder: createFullAdderAtoms,
} as const;

type Registry = typeof registry;

export const registryKeys = [
  'number',
  'nand',
  'halfAdder',
  'or',
  'fullAdder',
] satisfies (keyof Registry)[];

export const registryNames = {
  number: '0/1',
  nand: 'NAND',
  halfAdder: 'Half Adder',
  or: 'OR',
  fullAdder: 'Full Adder',
} satisfies Record<RegistryKey, string>;

export type RegistryKey = (typeof registryKeys)[number];

export const isRegistryKey = (key: unknown): key is RegistryKey =>
  typeof key === 'string' && registryKeys.includes(key as RegistryKey);

export type RegistryAtoms<T extends RegistryKey = RegistryKey> = ReturnType<
  Registry[T]
>;
