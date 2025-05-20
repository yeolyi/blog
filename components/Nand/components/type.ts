import type { RegistryAtoms, RegistryKey } from '@/components/Nand/atoms';

export type NodeProps<T extends RegistryKey> = {
  id: string;
  data: { atoms: RegistryAtoms<T> };
  selected: boolean;
};
