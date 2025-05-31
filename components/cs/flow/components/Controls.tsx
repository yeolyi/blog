import { minZoomOptions } from '@/components/cs/flow';
import Button from '@/components/ui/Button';
import { bgMap } from '@/components/ui/theme';
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
  type LucideIcon,
  Maximize,
  Minus,
  Plus,
  Save,
  Trash,
} from 'lucide-react';
import {
  type ButtonHTMLAttributes,
  type ReactNode,
  useCallback,
  useState,
} from 'react';
import { type RegistryKey, registryNames } from '../atoms';
import type { TouchDeviceState } from '../hooks/useMobileState';

type MobileControlButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: LucideIcon;
  children?: ReactNode;
};

function MobileControlButton({
  icon: Icon,
  children,
  className = '',
  ...props
}: MobileControlButtonProps) {
  return (
    <button
      type="button"
      className={clsx(
        'w-8 h-8 flex items-center justify-center m-1 cursor-pointer',
        bgMap.gray,
        props.disabled && 'opacity-50',
        className,
      )}
      {...props}
    >
      {Icon ? (
        <Icon className="w-5 h-5 stroke-1 fill-none text-white" />
      ) : (
        children
      )}
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
  registryKeys?: RegistryKey[];
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
  registryKeys = [],
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
      {(touchOnlyState.type === 'desktop' ||
        (touchOnlyState.type === 'mobile' && touchOnlyState.value)) && (
        <>
          <div className="absolute top-0 left-0 right-0 flex justify-center z-10 pointer-events-none">
            <div className="flex gap-5 m-2 p-2 bg-black/50 pointer-events-auto">
              <div className="flex">
                {touchOnlyState.type === 'desktop' && (
                  <>
                    <MobileControlButton
                      icon={Plus}
                      onClick={() => rfInstance?.zoomIn()}
                    />
                    <MobileControlButton
                      icon={Minus}
                      onClick={() => rfInstance?.zoomOut()}
                    />
                  </>
                )}

                <MobileControlButton
                  icon={Maximize}
                  onClick={() => rfInstance?.fitView(minZoomOptions)}
                  disabled={
                    touchOnlyState.type === 'mobile' && !touchOnlyState.value
                  }
                />

                {touchOnlyState.type === 'mobile' && (
                  <MobileControlButton
                    icon={Trash}
                    onClick={onDelete}
                    disabled={
                      !touchOnlyState.value ||
                      (selectedNodes.length === 0 && selectedEdges.length === 0)
                    }
                  />
                )}
              </div>

              <div className="flex">
                <MobileControlButton icon={Save} onClick={onSave} />
                <MobileControlButton icon={Folder} onClick={onRestore} />
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
            <div className="p-2 m-2 bg-black/50 pointer-events-auto">
              <div className="flex gap-2">
                {registryKeys.map((key) => (
                  <MobileControlButton
                    key={key}
                    onClick={addNode(key)}
                    disabled={
                      touchOnlyState.type === 'mobile' && !touchOnlyState.value
                    }
                  >
                    <span className="text-sm">{registryNames[key]}</span>
                  </MobileControlButton>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {touchOnlyState.type === 'mobile' && (
        <Button
          className="absolute right-0 bottom-0 z-10 m-2"
          Icon={touchOnlyState.value ? LockOpen : Lock}
          bg="gray"
          onClick={() =>
            setTouchOnlyState({
              type: 'mobile',
              value: !touchOnlyState.value,
            })
          }
        />
      )}
    </>
  );
}
