import type {
  RegistryAtoms,
  RegistryKey,
} from '@/mdx/it-was-all-nand/Nand/atoms';

export type NodeProps<T extends RegistryKey> = {
  id: string;
  data: { atoms: RegistryAtoms<T> };
  selected: boolean;
};
