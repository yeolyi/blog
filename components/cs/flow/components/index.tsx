import type { RegistryKey } from '@/components/cs/flow/atoms';
import { BooleanNode } from '@/components/cs/flow/components/BooleanNode';
import { FullAdderNode } from '@/components/cs/flow/components/FullAdderNode';
import { HalfAdderNode } from '@/components/cs/flow/components/HalfAdderNode';
import { NandNode } from '@/components/cs/flow/components/NandNode';
import { OrNode } from '@/components/cs/flow/components/OrNode';
import type { ComponentType } from 'react';
import type { NodeProps } from './type';

export const nodeTypes = {
  number: BooleanNode,
  nand: NandNode,
  halfAdder: HalfAdderNode,
  or: OrNode,
  fullAdder: FullAdderNode,
} satisfies Record<RegistryKey, ComponentType<NodeProps<RegistryKey>>>;
