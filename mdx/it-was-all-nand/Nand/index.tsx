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
  ReactFlowProvider,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from '@xyflow/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import '@xyflow/react/dist/style.css';
import './style.css';

import { nodeTypes } from '@/mdx/it-was-all-nand/Nand/components';
import {
  type RegistryKey,
  isRegistryKey,
} from '@/mdx/it-was-all-nand/Nand/model/registry';
import { useNodeAtom } from '@/mdx/it-was-all-nand/Nand/model/useNodeAtom';
import { isTouchDevice } from '@/utils/isTouchDevice';
import { saveJSONToFile, selectJSONFromFile } from '@/utils/string';
import { Provider, createStore } from 'jotai';
import { Folder, Move, Save } from 'lucide-react';

const defaultEdgeOptions = {
  type: 'smoothstep' as const,
  animated: true,
  selectable: true,
};

const connectionLineStyle = { stroke: 'lightgray' };

const restoreJSON = (
  flow: ReactFlowJsonObject<Node, Edge>,
  addAtom: ReturnType<typeof useNodeAtom>['add'],
  connectAtom: ReturnType<typeof useNodeAtom>['connect'],
) => {
  const idMap = new Map<string, string>();

  const nodes = flow.nodes.map((node) => {
    if (isRegistryKey(node.type)) {
      const atoms = addAtom(node.type);
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

    connectAtom({
      source,
      target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
    });

    return { ...edge, source, target };
  });

  return { nodes, edges };
};

// 처음에는 NAND의 값은 atom으로 해보겠는데 연결이 바뀌는건 어떻게 표현하지? 그때는 어떻게 리렌더링하지? 했었는데
// 연결도 atom으로 표현하면 되겠더라
// 생각보다 모든걸 atom으로 표현한다는 사고방식이 어렵다.
function Flow({
  id,
  initialJSON,
}: {
  id: string;
  initialJSON?: ReactFlowJsonObject<Node, Edge>;
}) {
  const store = useMemo(() => createStore(), []);
  const {
    add: addAtom,
    remove: removeAtom,
    connect: connectAtom,
    disconnect: disconnectAtom,
  } = useNodeAtom(store);

  // 왜 dev에서 내용이 두 배가 되지??
  const initialFlow = useMemo(() => {
    if (!initialJSON) return;
    return restoreJSON(initialJSON, addAtom, connectAtom);
  }, [initialJSON, addAtom, connectAtom]);

  const [nodes, setNodes] = useState<Node[]>(initialFlow?.nodes ?? []);
  const [edges, setEdges] = useState<Edge[]>(initialFlow?.edges ?? []);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);

  const [panOnDrag, setPanOnDrag] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isTouch = isTouchDevice();
    if (isTouch) {
      setPanOnDrag(false);
    }
  }, []);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      // 노드 삭제 대응
      for (const change of changes) {
        if (change.type === 'remove') {
          removeAtom(change.id);
        }
      }
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [removeAtom],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((eds) => {
        for (const change of changes) {
          if (change.type !== 'remove') continue;

          // 엣지 삭제 대응
          const edge = eds.find((e) => e.id === change.id);
          if (!edge || !edge.targetHandle) continue;

          disconnectAtom({
            target: edge.target,
            targetHandle: edge.targetHandle,
          });
        }

        return applyEdgeChanges(changes, eds);
      });
    },
    [disconnectAtom],
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      // 노드 연결 대응
      if (connection.sourceHandle && connection.targetHandle) {
        connectAtom({
          source: connection.source,
          target: connection.target,
          sourceHandle: connection.sourceHandle,
          targetHandle: connection.targetHandle,
        });
      }

      setEdges((eds) => addEdge(connection, eds));
    },
    [connectAtom],
  );

  const addNode = (type: RegistryKey) => () => {
    const atoms = addAtom(type);
    const position = { x: 0, y: nodes.length * 5 };
    const item = { id: atoms.id, type, position, data: { atoms } };
    setNodes((nds) => [...nds, item]);
  };

  const onSave = () => {
    if (!rfInstance) return;
    const flow = rfInstance.toObject();
    const json = JSON.stringify(flow);
    saveJSONToFile(json, 'nand.json');
  };

  const onRestore = async () => {
    const json = await selectJSONFromFile();
    const flow = JSON.parse(json) as ReactFlowJsonObject<Node, Edge>;
    const { nodes, edges } = restoreJSON(flow, addAtom, connectAtom);
    setNodes(nodes);
    setEdges(edges);
  };

  return (
    <Provider store={store}>
      <ReactFlowProvider>
        <div className="h-[400px] not-prose font-sans overflow-hidden">
          <ReactFlow
            onInit={setRfInstance}
            id={id}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            colorMode="dark"
            nodeTypes={nodeTypes}
            defaultEdgeOptions={defaultEdgeOptions}
            connectionLineType={ConnectionLineType.SmoothStep}
            connectionLineStyle={connectionLineStyle}
            fitView
            fitViewOptions={{ padding: 2 }}
            proOptions={{ hideAttribution: true }}
            zoomOnScroll={false}
            preventScrolling={false}
            panOnDrag={panOnDrag ?? true}
            nodesDraggable={panOnDrag ?? true}
          >
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
            <Controls showInteractive={false} fitViewOptions={{ padding: 2 }}>
              {panOnDrag !== null && (
                <ControlButton
                  type="button"
                  onClick={() => setPanOnDrag(!panOnDrag)}
                  className="text-xs"
                >
                  <Move
                    style={{ fill: 'none', opacity: panOnDrag ? 1 : 0.5 }}
                    className="w-[12px] h-[12px]"
                  />
                </ControlButton>
              )}
            </Controls>
            <Panel position="top-right">
              <ControlButton type="button" onClick={onSave}>
                <Save className="w-[12px] h-[12px]" style={{ fill: 'none' }} />
              </ControlButton>
              <ControlButton type="button" onClick={onRestore}>
                <Folder
                  className="w-[12px] h-[12px]"
                  style={{ fill: 'none' }}
                />
              </ControlButton>
            </Panel>
            <Background variant={BackgroundVariant.Dots} id={id} />
          </ReactFlow>
        </div>
      </ReactFlowProvider>
    </Provider>
  );
}

export default Flow;
