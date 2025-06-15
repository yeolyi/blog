'use client';

import {
  Background,
  BackgroundVariant,
  type Connection,
  ConnectionLineType,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  ReactFlow,
  type ReactFlowInstance,
  type ReactFlowJsonObject,
  ReactFlowProvider,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from '@xyflow/react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import type { RegistryKey } from '@/components/cs/flow/atoms';
import { nodeTypes } from '@/components/cs/flow/components';
import { Controls } from '@/components/cs/flow/components/Controls';
import { useTouchDeviceState } from '@/components/cs/flow/hooks/useMobileState';
import type { SaveFile } from '@/components/cs/flow/model/type';
import { useNodeAtom } from '@/components/cs/flow/model/useNodeAtom';
import { saveJSONToFile, selectJSONFromFile } from '@/utils/string';
import { Provider, createStore } from 'jotai';

export const minZoomOptions = { maxZoom: 1, padding: 0.25 };

// 처음에는 NAND의 값은 atom으로 해보겠는데 연결이 바뀌는건 어떻게 표현하지? 그때는 어떻게 리렌더링하지? 했었는데
// 연결도 atom으로 표현하면 되겠더라
// 모든걸 atom으로 표현한다는 사고방식이 생각보다 어렵다.
function Flow({
  id,
  initialJSON,
  height = 400,
  additionalRegistryKeys = [],
}: {
  id: string;
  initialJSON?: ReactFlowJsonObject<Node, Edge>;
  height?: number;
  additionalRegistryKeys?: RegistryKey[];
}) {
  const store = useMemo(() => createStore(), []);
  const {
    add: addAtom,
    remove: removeAtom,
    connect: connectAtom,
    disconnect: disconnectAtom,
    restore: restoreAtom,
    stringify: stringifyAtom,
  } = useNodeAtom(store);

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);

  const [touchOnlyState, setTouchOnlyState] = useTouchDeviceState();

  useEffect(() => {
    if (initialJSON) {
      const { nodes, edges } = restoreAtom(initialJSON as SaveFile);
      setNodes(nodes);
      setEdges(edges);
    }
  }, [initialJSON, restoreAtom]);

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
      // 콜백도 두 번 불린다 아...
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
    const save: SaveFile = { ...flow, nodeOutputs: stringifyAtom() };
    const json = JSON.stringify(save);
    saveJSONToFile(json, 'save.json');
  };

  const onRestore = async () => {
    const json = await selectJSONFromFile();
    const flow = JSON.parse(json) as SaveFile;

    const { nodes, edges } = restoreAtom(flow);

    setNodes((nds) => [...nds, ...nodes]);
    setEdges((eds) => [...eds, ...edges]);
  };

  const isInteractionEnabled =
    touchOnlyState.type === 'desktop' ||
    (touchOnlyState.type === 'mobile' && touchOnlyState.value);

  return (
    <Provider store={store}>
      <ReactFlowProvider>
        <div
          className="not-prose font-sans overflow-hidden"
          style={{ height: `${height}px` }}
        >
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
            defaultEdgeOptions={{
              type: ConnectionLineType.Bezier,
              animated: true,
              selectable: true,
            }}
            connectionLineType={ConnectionLineType.Bezier}
            connectionLineStyle={{ stroke: 'lightgray' }}
            fitView
            fitViewOptions={minZoomOptions}
            proOptions={{ hideAttribution: true }}
            preventScrolling={false}
            // TODO: 노드가 모바일 드래그를 막는 문제 해결
            panOnDrag={isInteractionEnabled}
            nodesDraggable={isInteractionEnabled}
            nodesConnectable={isInteractionEnabled}
            zoomOnDoubleClick={false}
            snapToGrid
            snapGrid={[4, 4]}
          >
            <Controls
              rfInstance={rfInstance}
              touchOnlyState={touchOnlyState}
              setTouchOnlyState={setTouchOnlyState}
              addNode={addNode}
              onSave={onSave}
              onRestore={onRestore}
              onDeleteNode={(id) => onNodesChange([{ type: 'remove', id }])}
              onDeleteEdge={(id) => onEdgesChange([{ type: 'remove', id }])}
              registryKeys={[
                'number',
                'nand',
                'label',
                ...additionalRegistryKeys,
              ]}
            />
            <Background
              bgColor="var(--color-stone-800)"
              variant={BackgroundVariant.Dots}
              id={id}
            />
          </ReactFlow>
        </div>
      </ReactFlowProvider>
    </Provider>
  );
}

export default Flow;
