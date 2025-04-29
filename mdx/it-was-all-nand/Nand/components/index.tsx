import { BooleanNode } from '@/mdx/it-was-all-nand/Nand/components/BooleanNode';
import { NandNode } from '@/mdx/it-was-all-nand/Nand/components/NandNode';
import type {
  Registry,
  RegistryAtoms,
} from '@/mdx/it-was-all-nand/Nand/model/registry';
import type { RegistryKey } from '@/mdx/it-was-all-nand/Nand/model/registry';
import type { ComponentType } from 'react';

export type NodeProps<T extends RegistryKey> = {
  id: string;
  data: { atoms: RegistryAtoms<T> };
  selected: boolean;
};

export const nodeTypes = {
  number: BooleanNode,
  nand: NandNode,
} satisfies Record<RegistryKey, ComponentType<NodeProps<RegistryKey>>>;
