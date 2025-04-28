import { ControlButton, Controls, Panel } from '@xyflow/react';
import { Folder, Lock, Move, Save, Unlock } from 'lucide-react';

interface MyControlsProps {
  onClickAddNumber: () => void;
  onClickAddNand: () => void;
  onSave: () => void;
  onRestore: () => void;
  panOnDrag: boolean | null;
  setPanOnDrag: (panOnDrag: boolean) => void;
}

const MyControls = ({
  onClickAddNumber,
  onClickAddNand,
  onSave,
  onRestore,
  panOnDrag,
  setPanOnDrag,
}: MyControlsProps) => {
  return (
    <>
      <Panel position="top-left">
        <ControlButton type="button" onClick={onClickAddNand}>
          <div className="border border-white w-[80%] h-[60%] rounded-r-full" />
        </ControlButton>
        <ControlButton
          type="button"
          onClick={onClickAddNumber}
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
          <Folder className="w-[12px] h-[12px]" style={{ fill: 'none' }} />
        </ControlButton>
      </Panel>
    </>
  );
};

export default MyControls;
