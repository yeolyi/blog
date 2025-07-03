import { createAndAtoms } from '@/components/cs/flow/atoms/and';
import { createDLatchAtoms } from '@/components/cs/flow/atoms/dLatch';
import { createFullAdderAtoms } from '@/components/cs/flow/atoms/fullAdder';
import { createHalfAdderAtoms } from '@/components/cs/flow/atoms/halfAdder';
import { createLabelAtoms } from '@/components/cs/flow/atoms/label';
import { createNandAtoms } from '@/components/cs/flow/atoms/nand';
import { createNorAtoms } from '@/components/cs/flow/atoms/nor';
import { createNotAtoms } from '@/components/cs/flow/atoms/not';
import { createOrAtoms } from '@/components/cs/flow/atoms/or';
import { createBooleanAtoms } from './boolean';

export const registry = {
	number: createBooleanAtoms,
	nand: createNandAtoms,
	halfAdder: createHalfAdderAtoms,
	or: createOrAtoms,
	fullAdder: createFullAdderAtoms,
	label: createLabelAtoms,
	nor: createNorAtoms,
	and: createAndAtoms,
	not: createNotAtoms,
	dLatch: createDLatchAtoms,
} as const;

type Registry = typeof registry;

export const registryKeys = [
	'number',
	'label',
	'nand',
	'and',
	'or',
	'not',
	'nor',
	'halfAdder',
	'fullAdder',
	'dLatch',
] satisfies (keyof Registry)[];

export const registryNames = {
	number: '0/1',
	nand: 'NAND',
	halfAdder: 'Half Adder',
	or: 'OR',
	fullAdder: 'Full Adder',
	label: 'Label',
	nor: 'NOR',
	and: 'AND',
	not: 'NOT',
	dLatch: 'D Latch',
} satisfies Record<RegistryKey, string>;

export type RegistryKey = (typeof registryKeys)[number];

export const isRegistryKey = (key: unknown): key is RegistryKey =>
	typeof key === 'string' && registryKeys.includes(key as RegistryKey);

export type RegistryAtoms<T extends RegistryKey = RegistryKey> = ReturnType<
	Registry[T]
>;
