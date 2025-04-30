import { minZoomOptions } from '@/app/[locale]/components/Nand';
import type { ReactFlowInstance } from '@xyflow/react';
import {
  Folder,
  Lock,
  LockOpen,
  Maximize,
  Minus,
  Plus,
  Save,
} from 'lucide-react';
import type { ReactNode } from 'react';
import type { RegistryKey } from '../atoms';

interface MobileControlButtonProps {
  onClick: () => void;
  children: ReactNode;
  className?: string;
}

// 모바일 친화적인 컨트롤 버튼 컴포넌트
function MobileControlButton({
  onClick,
  children,
  className = '',
}: MobileControlButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-8 h-8 flex items-center justify-center m-1 bg-[rgb(43,43,43)] cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
}

interface ControlsProps {
  rfInstance: ReactFlowInstance | null;
  touchOnlyState: boolean | null;
  setTouchOnlyState: (value: boolean) => void;
  addNode: (type: RegistryKey) => () => void;
  onSave: () => void;
  onRestore: () => void;
}

export function Controls({
  rfInstance,
  touchOnlyState,
  setTouchOnlyState,
  addNode,
  onSave,
  onRestore,
}: ControlsProps) {
  return (
    <>
      <div className="absolute top-0 left-0 right-0 flex justify-center z-10">
        <div className="flex gap-5 m-2 p-2 bg-black/50">
          <div className="flex">
            {touchOnlyState === null && (
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
            >
              <Maximize className="w-5 h-5 stroke-1 fill-none text-white" />
            </MobileControlButton>
            {touchOnlyState !== null && (
              <MobileControlButton
                onClick={() => setTouchOnlyState(!touchOnlyState)}
              >
                {touchOnlyState ? (
                  <LockOpen className="w-5 h-5 stroke-1 fill-none" />
                ) : (
                  <Lock className="w-5 h-5 stroke-1 fill-none" />
                )}
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

      <div className="absolute top-0 left-0 bottom-0 flex flex-col justify-center z-10">
        <div className="flex flex-col gap-4 p-2 m-2 bg-black/50">
          <div className="flex flex-col">
            <MobileControlButton onClick={addNode('number')}>
              0/1
            </MobileControlButton>
            <MobileControlButton onClick={addNode('nand')}>
              NAND
            </MobileControlButton>
          </div>
        </div>
      </div>
    </>
  );
}
