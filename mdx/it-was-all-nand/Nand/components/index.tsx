import type { RegistryKey } from '@/mdx/it-was-all-nand/Nand/atoms';
import { BooleanNode } from '@/mdx/it-was-all-nand/Nand/components/BooleanNode';
import { NandNode } from '@/mdx/it-was-all-nand/Nand/components/NandNode';
import type { ComponentType } from 'react';
import type { NodeProps } from './type';

export const nodeTypes = {
  number: BooleanNode,
  nand: NandNode,
} satisfies Record<RegistryKey, ComponentType<NodeProps<RegistryKey>>>;
