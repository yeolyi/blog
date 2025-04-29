import {
  type RegistryKey,
  isRegistryKey,
  registry,
} from '@/mdx/it-was-all-nand/Nand/atoms';
import type {
  JotaiStore,
  NodeAtoms,
} from '@/mdx/it-was-all-nand/Nand/model/type';
import type { Edge } from '@xyflow/react';
import type { Node, ReactFlowJsonObject } from '@xyflow/react';
import { useCallback, useRef } from 'react';

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
      if (!atom) {
        throw new Error('Node atom not found');
      }

      const inputAtoms = Object.values(atom.inputAtoms);
      if (inputAtoms.some((input) => store.get(input))) {
        throw new Error('Input atom is still connected');
      }

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

      if (!sourceHandleAtom || !targetHandleAtom) {
        throw new Error('Source or target atom not found');
      }

      // 처음에는 노드 컴포넌트에서 했는데 jotai에서 store라는걸 지원함
      // 문서보니 안쓰는게 좋다는거같은데 뭐...
      store.set(targetHandleAtom, sourceHandleAtom);
    },
    [store],
  );

  const disconnect = useCallback(
    ({ target, targetHandle }: { target: string; targetHandle: string }) => {
      const targetNode = map.current.get(target);
      if (!targetNode) {
        throw new Error('Target node not found');
      }

      const targetHandleAtom = targetNode.inputAtoms[targetHandle];

      if (!targetHandleAtom) {
        throw new Error('Target handle atom not found');
      }

      store.set(targetHandleAtom, null);
    },
    [store],
  );

  const restore = useCallback(
    (flow: ReactFlowJsonObject<Node, Edge>) => {
      const idMap = new Map<string, string>();

      const nodes = flow.nodes.map((node) => {
        if (isRegistryKey(node.type)) {
          const atoms = add(node.type);
          idMap.set(node.id, atoms.id);
          return { ...node, id: atoms.id, data: { atoms } };
        }
        return node;
      });

      const edges = flow.edges.map((edge) => {
        if (!edge.sourceHandle || !edge.targetHandle) return edge;

        const source = idMap.get(edge.source);
        const target = idMap.get(edge.target);
        if (!source || !target) return edge;

        connect({
          source,
          target,
          sourceHandle: edge.sourceHandle,
          targetHandle: edge.targetHandle,
        });

        return { ...edge, source, target };
      });

      return { nodes, edges };
    },
    [add, connect],
  );

  const save = useCallback(() => {
    // TODO
  }, []);

  return { registry, add, remove, connect, disconnect, restore, save };
};
