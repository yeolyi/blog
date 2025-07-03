import { useCallback, useRef } from 'react';
import {
	isRegistryKey,
	type RegistryKey,
	registry,
} from '@/components/cs/flow/atoms';
import type {
	JotaiStore,
	NodeAtoms,
	NodeOutput,
	NodeOutputs,
	SaveFile,
} from '@/components/cs/flow/model/type';

// setState 콜백이 두 번 불리기에 일단 에러 처리는 간단하게만 한다.
// (무슨 에러였지... 아 이미 있는 노드랑 엣지 추가하는거였나?)
// TODO: 더 나은 방법
export const useNodeAtom = (store: JotaiStore) => {
	const map = useRef<Map<string, NodeAtoms>>(new Map());

	const add = useCallback((type: RegistryKey) => {
		const getAtom = registry[type];
		const id = crypto.randomUUID();
		const atom = { ...getAtom(), id };
		map.current.set(id, atom);

		return atom;
	}, []);

	const remove = useCallback(
		(id: string) => {
			const atom = map.current.get(id);
			if (!atom) return;

			const inputAtoms = Object.values(atom.inputAtoms);
			if (inputAtoms.some((input) => store.get(input))) return;

			map.current.delete(id);
		},
		[store],
	);

	const connect = useCallback(
		({
			source,
			target,
			sourceHandle,
			targetHandle,
		}: {
			source: string;
			target: string;
			sourceHandle: string;
			targetHandle: string;
		}) => {
			const sourceNode = map.current.get(source);
			const targetNode = map.current.get(target);

			if (!sourceNode || !targetNode) {
				throw new Error('Source or target node not found');
			}

			const sourceHandleAtom = sourceNode.outputAtoms?.[sourceHandle];
			const targetHandleAtom = targetNode.inputAtoms?.[targetHandle];

			if (!sourceHandleAtom || !targetHandleAtom) return;

			// 처음에는 노드 컴포넌트에서 했는데 jotai에서 store라는걸 지원함
			// 문서보니 안쓰는게 좋다는거같은데 뭐...
			store.set(targetHandleAtom, sourceHandleAtom);
		},
		[store],
	);

	const disconnect = useCallback(
		({ target, targetHandle }: { target: string; targetHandle: string }) => {
			const targetNode = map.current.get(target);
			if (!targetNode) return;

			const targetHandleAtom = targetNode.inputAtoms[targetHandle];
			if (!targetHandleAtom) return;

			store.set(targetHandleAtom, null);
		},
		[store],
	);

	const restore = useCallback(
		({ nodes: prevNodes, edges: prevEdges, nodeOutputs }: SaveFile) => {
			const idMap = new Map<string, { id: string; data: { atoms: NodeAtoms } }>();

			const nodes = prevNodes.map((node) => {
				if (isRegistryKey(node.type)) {
					const atoms = add(node.type);
					idMap.set(node.id, { id: atoms.id, data: { atoms } });
					return {
						...node,
						id: atoms.id,
						data: { atoms },
						// 선택 상태는 저장하지 않는다
						selected: false,
					};
				}
				return node;
			});

			const edges = prevEdges.map((edge) => {
				if (!edge.sourceHandle || !edge.targetHandle) return edge;

				const source = idMap.get(edge.source)?.id;
				const target = idMap.get(edge.target)?.id;
				if (!source || !target) return edge;

				connect({
					source,
					target,
					sourceHandle: edge.sourceHandle,
					targetHandle: edge.targetHandle,
				});

				return {
					...edge,
					id: crypto.randomUUID(),
					source,
					target,
					// 선택 상태는 저장하지 않는다
					selected: false,
				};
			});

			if (nodeOutputs) {
				for (const [prevId, handles] of Object.entries(nodeOutputs)) {
					const newId = idMap.get(prevId)?.id;
					if (!newId) continue;

					const atom = map.current.get(newId);
					if (!atom) continue;

					for (const [handle, value] of Object.entries(handles)) {
						store.set(atom.outputAtoms[handle], value);
					}
				}
			}

			return { nodes, edges };
		},
		[add, connect, store],
	);

	const stringify = useCallback(() => {
		return map.current
			.entries()
			.reduce<NodeOutputs>((acc, [nodeId, nodeAtom]) => {
				acc[nodeId] = Object.entries(nodeAtom.outputAtoms).reduce<NodeOutput>(
					(outputs, [outputId, outputAtom]) => {
						outputs[outputId] = store.get(outputAtom);
						return outputs;
					},
					{},
				);

				return acc;
			}, {});
	}, [store]);

	return { add, remove, connect, disconnect, restore, stringify };
};
