import { NandNode } from '@/mdx/it-was-all-nand/Nand/node/NandNode';
import { NumberNode } from '@/mdx/it-was-all-nand/Nand/node/NumberNode';
import {
  ConnectionLineType,
  ReactFlow,
  type ReactFlowInstance,
  type ReactFlowProps,
} from '@xyflow/react';

interface MyReactFlowProps extends ReactFlowProps {
  setRefInstance: (instance: ReactFlowInstance) => void;
}

const nodeTypes = {
  nand: NandNode,
  number: NumberNode,
};

const defaultEdgeOptions = {
  type: 'smoothstep' as const,
  animated: true,
  selectable: true,
};

const connectionLineStyle = { stroke: 'lightgray' };

const MyReactFlow = (props: MyReactFlowProps & { panOnDrag: boolean }) => {
  const { setRefInstance, panOnDrag, ...rest } = props;

  return (
    <ReactFlow
      {...rest}
      onInit={setRefInstance}
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
      panOnDrag={panOnDrag}
    />
  );
};

export default MyReactFlow;
