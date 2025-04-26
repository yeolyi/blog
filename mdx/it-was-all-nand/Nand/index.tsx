'use client';

import {
  Background,
  BackgroundVariant,
  type Connection,
  ConnectionLineType,
  ControlButton,
  Controls,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  Panel,
  ReactFlow,
  type ReactFlowInstance,
  type ReactFlowJsonObject,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  useReactFlow,
} from '@xyflow/react';
import { useCallback, useRef, useState } from 'react';
import '@xyflow/react/dist/style.css';
import './style.css';
import {
  NandNode,
  type NandNodeAtoms,
} from '@/mdx/it-was-all-nand/Nand/NandNode';
import {
  NumberNode,
  type NumberNodeAtoms,
} from '@/mdx/it-was-all-nand/Nand/NumberNode';
import {
  createNandAtoms,
  createNumberAtoms,
} from '@/mdx/it-was-all-nand/Nand/atom';

import { Provider, createStore } from 'jotai';
import { Folder, Save } from 'lucide-react';

const store = createStore();

// 처음에는 NAND의 값은 atom으로 해보겠는데 연결이 바뀌는건 어떻게 표현하지? 그때는 어떻게 리렌더링하지? 했었는데
// 연결도 atom으로 표현하면 되겠더라
// 생각보다 모든걸 atom으로 표현한다는 사고방식이 어렵다.
function Flow() {
  const nodeId = useRef(0);
  const edgeId = useRef(0);

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);

  const atomMap = useRef<Map<string, NumberNodeAtoms | NandNodeAtoms>>(
    new Map(),
  );

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    for (const change of changes) {
      if (change.type === 'remove') {
        atomMap.current.delete(change.id);
      }
    }

    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => {
      for (const change of changes) {
        if (change.type === 'remove') {
          const edge = eds.find((e) => e.id === change.id);
          if (!edge) {
            console.error('edge is undefined', change);
            continue;
          }

          const targetId = edge.target;
          const targetAtoms = atomMap.current.get(targetId);
          if (!targetAtoms) {
            console.error('targetAtoms is undefined', targetId);
            continue;
          }

          const targetHandle = edge.targetHandle;
          if (targetAtoms.type === 'nand') {
            const targetInAtom =
              targetHandle === 'in1' ? targetAtoms.in1 : targetAtoms.in2;
            store.set(targetInAtom, null);
          }
        }
      }

      return applyEdgeChanges(changes, eds);
    });
  }, []);

  // 처음에는 노드 컴포넌트에서 했는데 jotai에서 store라는걸 지원함
  // 문서보니 안쓰는게 좋다는거같은데 뭐...
  const connectNodeAtoms = useCallback((connection: Connection) => {
    const atoms = atomMap.current.get(connection.target);
    if (!atoms) {
      console.error('atoms is undefined', connection);
      return;
    }

    if (atoms.type === 'nand') {
      if (connection.targetHandle === 'in1') {
        store.set(atoms.in1, connection.source);
      } else if (connection.targetHandle === 'in2') {
        store.set(atoms.in2, connection.source);
      }
    }
  }, []);

  const onConnect = useCallback(
    (connection: Connection) => {
      connectNodeAtoms(connection);
      setEdges((eds) => addEdge(connection, eds));
    },
    [connectNodeAtoms],
  );

  const addNode = (type: string) => () => {
    const id = `node-${nodeId.current}`;
    nodeId.current++;

    const atoms =
      type === 'nand'
        ? createNandAtoms(atomMap.current)
        : createNumberAtoms(atomMap.current);

    atomMap.current.set(id, atoms);

    const item = {
      id,
      type,
      position: { x: 0, y: nodes.length * 75 },
      data: { atoms },
    };
    setNodes((nds) => [...nds, item]);
  };

  const onSave = () => {
    if (!rfInstance) return;

    const flow = rfInstance.toObject();
    const json = JSON.stringify(flow);

    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'nand.json';

    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  const onRestore = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const json = e.target?.result as string;
        const flow = JSON.parse(json) as ReactFlowJsonObject<Node, Edge>;

        if (flow) {
          const idMap = new Map<string, string>();

          const nodes = flow.nodes.map((node) => {
            const id = `node-${nodeId.current}`;
            nodeId.current++;
            idMap.set(node.id, id);
            const atoms =
              node.type === 'nand'
                ? createNandAtoms(atomMap.current)
                : createNumberAtoms(atomMap.current);
            atomMap.current.set(id, atoms);
            return { ...node, id, data: { atoms } };
          });
          setNodes((nds) => [...nds, ...nodes]);

          const edges = flow.edges.map((edge) => {
            const id = `edge-${edgeId.current}`;
            edgeId.current++;
            const source = idMap.get(edge.source);
            const target = idMap.get(edge.target);
            if (!source || !target) {
              console.error('source or target is undefined', edge);
              return edge;
            }
            connectNodeAtoms({
              source,
              target,
              sourceHandle: edge.sourceHandle ?? null,
              targetHandle: edge.targetHandle ?? null,
            });
            return { ...edge, id, source, target };
          });
          setEdges((eds) => [...eds, ...edges]);
          const { x = 0, y = 0, zoom = 1 } = flow.viewport;
          rfInstance?.setViewport({ x, y, zoom });
        }
      };
      reader.readAsText(file);
    };

    input.click();
  };

  return (
    <Provider store={store}>
      <div className="h-[400px] w-[500px] relative not-prose font-sans">
        <ReactFlow
          colorMode="dark"
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={{
            nand: NandNode,
            number: NumberNode,
          }}
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: true,
            selectable: true,
          }}
          connectionLineType={ConnectionLineType.SmoothStep}
          connectionLineStyle={{ stroke: 'lightgray' }}
          fitView
          fitViewOptions={{ padding: 2 }}
          proOptions={{ hideAttribution: true }}
          onInit={setRfInstance}
        >
          <Background variant={BackgroundVariant.Dots} />
          <Panel position="top-left">
            <ControlButton type="button" onClick={addNode('nand')}>
              <div className="border border-white w-[80%] h-[60%] rounded-r-full" />
            </ControlButton>
            <ControlButton
              type="button"
              onClick={addNode('number')}
              className="text-xs"
            >
              01
            </ControlButton>
          </Panel>
          <Controls showInteractive={false} fitViewOptions={{ padding: 2 }} />
          <Panel position="top-right">
            <ControlButton type="button" onClick={onSave}>
              <Save className="w-[12px] h-[12px]" style={{ fill: 'none' }} />
            </ControlButton>
            <ControlButton type="button" onClick={onRestore}>
              <Folder className="w-[12px] h-[12px]" style={{ fill: 'none' }} />
            </ControlButton>
          </Panel>
        </ReactFlow>
      </div>
    </Provider>
  );
}

export default Flow;
