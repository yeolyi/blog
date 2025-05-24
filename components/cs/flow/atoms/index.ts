import { createNandAtoms } from '@/components/cs/flow/atoms/nand';
import { createBooleanAtoms } from './boolean';

export const registry = {
  number: createBooleanAtoms,
  nand: createNandAtoms,
} as const;

type Registry = typeof registry;

export const registryKeys = ['number', 'nand'] satisfies (keyof Registry)[];
export type RegistryKey = (typeof registryKeys)[number];

export const isRegistryKey = (key: unknown): key is RegistryKey =>
  typeof key === 'string' && registryKeys.includes(key as RegistryKey);

export type RegistryAtoms<T extends RegistryKey = RegistryKey> = ReturnType<
  Registry[T]
>;
