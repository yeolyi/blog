import type { RegistryKey } from '@/app/[locale]/components/Nand/atoms';
import { BooleanNode } from '@/app/[locale]/components/Nand/components/BooleanNode';
import { NandNode } from '@/app/[locale]/components/Nand/components/NandNode';
import type { ComponentType } from 'react';
import type { NodeProps } from './type';

export const nodeTypes = {
  number: BooleanNode,
  nand: NandNode,
} satisfies Record<RegistryKey, ComponentType<NodeProps<RegistryKey>>>;
