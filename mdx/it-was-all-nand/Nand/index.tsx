'use client';

import {
  Background,
  BackgroundVariant,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  type ReactFlowInstance,
  type ReactFlowJsonObject,
  ReactFlowProvider,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from '@xyflow/react';
import { useCallback, useMemo, useRef, useState } from 'react';
import '@xyflow/react/dist/style.css';
import './style.css';
import { createAtoms } from '@/mdx/it-was-all-nand/Nand/atom';
import type { CustomNodeAtoms } from '@/mdx/it-was-all-nand/Nand/node';

import MyControls from '@/mdx/it-was-all-nand/Nand/components/MyControl';
import MyReactFlow from '@/mdx/it-was-all-nand/Nand/components/MyReactFlow';
import { restoreFlow } from '@/mdx/it-was-all-nand/Nand/utils/restoreFlow';
import { useNewId } from '@/mdx/it-was-all-nand/Nand/utils/useNewId';
import { isTouchDevice } from '@/utils/isTouchDevice';
import { saveJSONToFile, selectJSONFromFile } from '@/utils/string';
import { Provider, createStore } from 'jotai';

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

  const createNodeId = useNewId();
  const createEdgeId = useNewId();
  // 왜 dev에서 내용이 두 배가 되지??
  const atomMap = useRef<Map<string, CustomNodeAtoms>>(new Map());
  const initialFlow = useMemo(
    () =>
      initialJSON &&
      restoreFlow(
        store,
        initialJSON,
        atomMap.current,
        createNodeId,
        createEdgeId,
      ),
    [initialJSON, createNodeId, createEdgeId, store],
  );

  const [nodes, setNodes] = useState<Node[]>(initialFlow?.nodes ?? []);
  const [edges, setEdges] = useState<Edge[]>(initialFlow?.edges ?? []);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const [panOnDrag, setPanOnDrag] = useState(() => {
    // 서버값을 false로 하면 로컬에서 개발할 때 hydration 오류가 뜸...
    // 편의를 위해 true로 기본값 설정
    if (typeof window === 'undefined') return true;
    return !isTouchDevice();
  });

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    // 노드 삭제 대응
    for (const change of changes) {
      if (change.type === 'remove') {
        atomMap.current.delete(change.id);
      }
    }
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((eds) => {
        for (const change of changes) {
          if (change.type !== 'remove') continue;

          // 엣지 삭제 대응
          const edge = eds.find((e) => e.id === change.id);
          if (!edge) continue;
          const targetHandle = edge.targetHandle;

          const targetAtoms = atomMap.current.get(edge.target);
          if (!targetAtoms) continue;

          if (targetAtoms.type === 'nand') {
            store.set(
              targetHandle === 'in1' ? targetAtoms.in1 : targetAtoms.in2,
              null,
            );
          }
        }

        return applyEdgeChanges(changes, eds);
      });
    },
    [store],
  );

  // 처음에는 노드 컴포넌트에서 했는데 jotai에서 store라는걸 지원함
  // 문서보니 안쓰는게 좋다는거같은데 뭐...
  const onConnect = useCallback(
    (connection: Connection) => {
      // 노드 연결 대응
      const atoms = atomMap.current.get(connection.target);
      if (!atoms) return;

      if (atoms.type === 'nand') {
        store.set(
          connection.targetHandle === 'in1' ? atoms.in1 : atoms.in2,
          connection.source,
        );
      }
      setEdges((eds) => addEdge(connection, eds));
    },
    [store],
  );

  const addNode = (type: string) => () => {
    const id = createNodeId();
    const atoms = createAtoms(type, atomMap.current);
    atomMap.current.set(id, atoms);
    const position = { x: 0, y: nodes.length * 5 };

    const item = { id, type, position, data: { atoms } };
    setNodes((nds) => [...nds, item]);
  };

  const onSave = () => {
    if (!rfInstance) return;
    const flow = rfInstance.toObject();
    const json = JSON.stringify(flow);
    saveJSONToFile(json, 'nand.json');
  };

  const restoreJSON = useCallback(
    async (flow: ReactFlowJsonObject<Node, Edge>) => {
      const { nodes: restoredNodes, edges: restoredEdges } = restoreFlow(
        store,
        flow,
        atomMap.current,
        createNodeId,
        createEdgeId,
      );
      setNodes((nds) => [...nds, ...restoredNodes]);
      setEdges((eds) => [...eds, ...restoredEdges]);
    },
    [createNodeId, createEdgeId, store],
  );

  const onRestore = async () => {
    const json = await selectJSONFromFile();
    const flow = JSON.parse(json) as ReactFlowJsonObject<Node, Edge>;
    restoreJSON(flow);
  };

  return (
    <Provider store={store}>
      <ReactFlowProvider>
        <div className="h-[400px] not-prose font-sans overflow-hidden">
          <MyReactFlow
            id={id}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            setRefInstance={setRfInstance}
            panOnDrag={panOnDrag}
          >
            <MyControls
              onClickAddNumber={addNode('number')}
              onClickAddNand={addNode('nand')}
              onSave={onSave}
              onRestore={onRestore}
              panOnDrag={panOnDrag}
              setPanOnDrag={setPanOnDrag}
            />
            <Background variant={BackgroundVariant.Dots} id={id} />
          </MyReactFlow>
        </div>
      </ReactFlowProvider>
    </Provider>
  );
}

export default Flow;
