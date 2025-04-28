import { ControlButton, Controls, Panel } from '@xyflow/react';
import { Folder, Lock, Save, Unlock } from 'lucide-react';

interface MyControlsProps {
  onClickAddNumber: () => void;
  onClickAddNand: () => void;
  onSave: () => void;
  onRestore: () => void;
  panOnDrag: boolean;
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
        <ControlButton
          type="button"
          onClick={() => setPanOnDrag(!panOnDrag)}
          className="text-xs"
        >
          {panOnDrag ? (
            <Lock style={{ fill: 'none' }} />
          ) : (
            <Unlock style={{ fill: 'none' }} />
          )}
        </ControlButton>
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
