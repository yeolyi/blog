import type {
  RegistryAtoms,
  RegistryKey,
} from '@/app/[locale]/components/Nand/atoms';

export type NodeProps<T extends RegistryKey> = {
  id: string;
  data: { atoms: RegistryAtoms<T> };
  selected: boolean;
};
