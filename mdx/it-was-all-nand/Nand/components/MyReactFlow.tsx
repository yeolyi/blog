import { NandNode } from '@/mdx/it-was-all-nand/Nand/node/NandNode';
import { NumberNode } from '@/mdx/it-was-all-nand/Nand/node/NumberNode';
import {
  ConnectionLineType,
  ReactFlow,
  type ReactFlowInstance,
  type ReactFlowProps,
} from '@xyflow/react';

const MyReactFlow = (
  props: ReactFlowProps & {
    setRefInstance: (instance: ReactFlowInstance) => void;
  },
) => {
  const { setRefInstance, ...rest } = props;
  return (
    <ReactFlow
      {...rest}
      onInit={setRefInstance}
      colorMode="dark"
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
    />
  );
};

export default MyReactFlow;
