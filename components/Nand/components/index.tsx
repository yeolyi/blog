import type { RegistryKey } from '@/components/Nand/atoms';
import { BooleanNode } from '@/components/Nand/components/BooleanNode';
import { NandNode } from '@/components/Nand/components/NandNode';
import type { ComponentType } from 'react';
import type { NodeProps } from './type';

export const nodeTypes = {
  number: BooleanNode,
  nand: NandNode,
} satisfies Record<RegistryKey, ComponentType<NodeProps<RegistryKey>>>;
