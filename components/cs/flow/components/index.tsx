import type { ComponentType } from 'react';
import type { RegistryKey } from '@/components/cs/flow/atoms';
import { AndNode } from '@/components/cs/flow/components/AndNode';
import { BooleanNode } from '@/components/cs/flow/components/BooleanNode';
import { DLatchNode } from '@/components/cs/flow/components/DLatchNode';
import { FullAdderNode } from '@/components/cs/flow/components/FullAdderNode';
import { HalfAdderNode } from '@/components/cs/flow/components/HalfAdderNode';
import { LabelNode } from '@/components/cs/flow/components/LabelNode';
import { NandNode } from '@/components/cs/flow/components/NandNode';
import { NorNode } from '@/components/cs/flow/components/NorNode';
import { NotNode } from '@/components/cs/flow/components/NotNode';
import { OrNode } from '@/components/cs/flow/components/OrNode';
import type { NodeProps } from './type';

export const nodeTypes = {
	number: BooleanNode,
	nand: NandNode,
	halfAdder: HalfAdderNode,
	or: OrNode,
	fullAdder: FullAdderNode,
	label: LabelNode,
	nor: NorNode,
	and: AndNode,
	not: NotNode,
	dLatch: DLatchNode,
} satisfies Record<RegistryKey, ComponentType<NodeProps<RegistryKey>>>;
