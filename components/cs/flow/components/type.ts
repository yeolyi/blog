import type { RegistryAtoms, RegistryKey } from '@/components/cs/flow/atoms';

export type NodeProps<T extends RegistryKey> = {
	id: string;
	data: { atoms: RegistryAtoms<T> };
	selected: boolean;
};
