import { minZoomOptions } from '@/app/[locale]/components/Nand';
import {
  type Edge,
  type Node,
  type ReactFlowInstance,
  useOnSelectionChange,
} from '@xyflow/react';
import clsx from 'clsx';
import {
  Folder,
  Lock,
  LockOpen,
  Maximize,
  Minus,
  Plus,
  Save,
  Trash,
} from 'lucide-react';
import { type ButtonHTMLAttributes, useCallback, useState } from 'react';
import type { RegistryKey } from '../atoms';
import type { TouchDeviceState } from '../hooks/useMobileState';
// 모바일 친화적인 컨트롤 버튼 컴포넌트
function MobileControlButton({
  children,
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={clsx(
        'w-8 h-8 flex items-center justify-center m-1 bg-[rgb(43,43,43)] cursor-pointer',
        props.disabled && 'opacity-50',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

interface ControlsProps {
  rfInstance: ReactFlowInstance | null;
  touchOnlyState: TouchDeviceState;
  setTouchOnlyState: (value: TouchDeviceState) => void;
  addNode: (type: RegistryKey) => () => void;
  onSave: () => void;
  onRestore: () => void;
  onDeleteNode: (id: string) => void;
  onDeleteEdge: (id: string) => void;
}

export function Controls({
  rfInstance,
  touchOnlyState,
  setTouchOnlyState,
  addNode,
  onSave,
  onRestore,
  onDeleteNode,
  onDeleteEdge,
}: ControlsProps) {
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [selectedEdges, setSelectedEdges] = useState<string[]>([]);

  const onChange = useCallback(
    ({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) => {
      setSelectedNodes(nodes.map((node) => node.id));
      setSelectedEdges(edges.map((edge) => edge.id));
    },
    [],
  );

  useOnSelectionChange({ onChange });

  const onDelete = () => {
    for (const node of selectedNodes) {
      onDeleteNode(node);
    }
    for (const edge of selectedEdges) {
      onDeleteEdge(edge);
    }
  };

  if (touchOnlyState.type === 'loading') {
    return null;
  }

  return (
    <>
      <div className="absolute top-0 left-0 right-0 flex justify-center z-10 pointer-events-none">
        <div className="flex gap-5 m-2 p-2 bg-black/50 pointer-events-auto">
          {touchOnlyState.type === 'mobile' && (
            <div className="flex">
              <MobileControlButton
                onClick={() =>
                  setTouchOnlyState({
                    type: 'mobile',
                    value: !touchOnlyState.value,
                  })
                }
              >
                {touchOnlyState.value ? (
                  <LockOpen className="w-5 h-5 stroke-1 fill-none" />
                ) : (
                  <Lock className="w-5 h-5 stroke-1 fill-none" />
                )}
              </MobileControlButton>
            </div>
          )}

          <div className="flex">
            {touchOnlyState.type === 'desktop' && (
              <>
                <MobileControlButton onClick={() => rfInstance?.zoomIn()}>
                  <Plus className="w-5 h-5 stroke-1 fill-none text-white" />
                </MobileControlButton>
                <MobileControlButton onClick={() => rfInstance?.zoomOut()}>
                  <Minus className="w-5 h-5 stroke-1 fill-none text-white" />
                </MobileControlButton>
              </>
            )}

            <MobileControlButton
              onClick={() => rfInstance?.fitView(minZoomOptions)}
              disabled={
                touchOnlyState.type === 'mobile' && !touchOnlyState.value
              }
            >
              <Maximize className="w-5 h-5 stroke-1 fill-none text-white" />
            </MobileControlButton>

            {touchOnlyState.type === 'mobile' && (
              <MobileControlButton
                onClick={onDelete}
                disabled={
                  !touchOnlyState.value ||
                  (selectedNodes.length === 0 && selectedEdges.length === 0)
                }
              >
                <Trash className="w-5 h-5 stroke-1 fill-none text-white" />
              </MobileControlButton>
            )}
          </div>

          <div className="flex">
            <MobileControlButton onClick={onSave}>
              <Save className="w-5 h-5 stroke-1 fill-none text-white" />
            </MobileControlButton>
            <MobileControlButton onClick={onRestore}>
              <Folder className="w-5 h-5 stroke-1 fill-none text-white" />
            </MobileControlButton>
          </div>
        </div>
      </div>

      <div className="absolute top-0 left-0 bottom-0 flex flex-col justify-center z-10 pointer-events-none">
        <div className="flex flex-col gap-4 p-2 m-2 bg-black/50 pointer-events-auto">
          <div className="flex flex-col">
            <MobileControlButton
              onClick={addNode('number')}
              disabled={
                touchOnlyState.type === 'mobile' && !touchOnlyState.value
              }
            >
              0/1
            </MobileControlButton>
            <MobileControlButton
              onClick={addNode('nand')}
              disabled={
                touchOnlyState.type === 'mobile' && !touchOnlyState.value
              }
            >
              NAND
            </MobileControlButton>
          </div>
        </div>
      </div>
    </>
  );
}
