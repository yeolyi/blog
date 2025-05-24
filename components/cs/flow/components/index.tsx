import type { RegistryKey } from '@/components/cs/flow/atoms';
import { BooleanNode } from '@/components/cs/flow/components/BooleanNode';
import { NandNode } from '@/components/cs/flow/components/NandNode';
import type { ComponentType } from 'react';
import type { NodeProps } from './type';

export const nodeTypes = {
  number: BooleanNode,
  nand: NandNode,
} satisfies Record<RegistryKey, ComponentType<NodeProps<RegistryKey>>>;
