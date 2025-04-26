import { nandStore } from '@/mdx/it-was-all-nand/Nand';
import { createAtoms, isCustomNode } from '@/mdx/it-was-all-nand/Nand/atom';
import type { CustomNodeAtoms } from '@/mdx/it-was-all-nand/Nand/node';
import type { Edge, Node, ReactFlowJsonObject } from '@xyflow/react';

export const restoreFlow = (
  flow: ReactFlowJsonObject<Node, Edge>,
  atomMap: Map<string, CustomNodeAtoms>,
  createNodeId: () => string,
  createEdgeId: () => string,
) => {
  const idMap = new Map<string, string>();

  const nodes = flow.nodes.map((node) => {
    if (!isCustomNode(node.type)) {
      return node;
    }

    const id = createNodeId();
    idMap.set(node.id, id);
    const atoms = createAtoms(node.type, atomMap);
    atomMap.set(id, atoms);

    return { ...node, id, data: { atoms } };
  });

  const edges = flow.edges.map((edge) => {
    const source = idMap.get(edge.source);
    const target = idMap.get(edge.target);
    if (!source || !target) return edge;

    const atoms = atomMap.get(target);
    if (!atoms) return edge;

    if (atoms.type === 'nand') {
      nandStore.set(
        edge.targetHandle === 'in1' ? atoms.in1 : atoms.in2,
        source,
      );
    }

    const id = createEdgeId();
    return { ...edge, id, source, target };
  });

  return { nodes, edges };
};
