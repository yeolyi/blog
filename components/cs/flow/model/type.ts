import type { Edge, Node, ReactFlowJsonObject } from '@xyflow/react';
import type { Atom, createStore, PrimitiveAtom } from 'jotai';

export type JotaiStore = ReturnType<typeof createStore>;

export type NodeCreator<T extends NodeAtoms> = (
	initialValues?: {
		[key in keyof T['outputAtoms']]: boolean;
	},
) => Omit<T, 'id'>;

// 출력을 derived atom이 아닌 별도 상태로 관리
// 사이클 방지 + 딜레이 구현을 위함
export type OutputValue =
	// true/false
	| boolean
	// 4bit 8bit 16bit...
	| number
	// 라벨 처리 귀찮아서...
	// InputAtom에서 가려서 받아야할까
	| string
	// 미정
	| null;

export type OutputAtom = PrimitiveAtom<OutputValue>;
export type InputAtom = PrimitiveAtom<OutputAtom | null>;

// 특정 노드의 상태를 표현
export type NodeAtoms<
	InputKeys extends string | never = string | never,
	OutputKeys extends string | never = string | never,
	HasEffect extends boolean = boolean,
> = {
	id: string;
	inputAtoms: { [key in InputKeys]: InputAtom };
	outputAtoms: { [key in OutputKeys]: OutputAtom };
	// 사이클 방지 + 딜레이 구현을 위함
	effectAtom: HasEffect extends true ? Atom<void> : undefined;
};

export type NodeOutput = Record<string, OutputValue>;

export type NodeOutputs = Record<string, NodeOutput>;

export type SaveFile = ReactFlowJsonObject<Node, Edge> & {
	nodeOutputs: NodeOutputs;
};
