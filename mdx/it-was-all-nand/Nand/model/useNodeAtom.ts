import {
  type RegistryKey,
  registry,
} from '@/mdx/it-was-all-nand/Nand/model/registry';
import type {
  JotaiStore,
  NodeAtoms,
} from '@/mdx/it-was-all-nand/Nand/model/type';
import { useCallback, useRef } from 'react';

export const useNodeAtom = (store: JotaiStore) => {
  const map = useRef<
    Map<string, NodeAtoms<string | never, string | never, boolean>>
  >(new Map());

  const add = useCallback(
    (type: RegistryKey) => {
      const getAtom = registry[type];
      if (!getAtom) {
        throw new Error(`Node type ${type} not found`);
      }

      const id = crypto.randomUUID();
      const atom = { ...getAtom(store), id };
      map.current.set(id, atom);

      return atom;
    },
    [store],
  );

  const remove = useCallback(
    (id: string) => {
      const atom = map.current.get(id);

      const inputAtoms = Object.values(atom?.inputAtoms ?? {});
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

  return { registry, add, remove, connect, disconnect };
};
