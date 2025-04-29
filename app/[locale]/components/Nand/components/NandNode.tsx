import type { NodeProps } from '@/app/[locale]/components/Nand/components/type';
import { Handle, Position, useNodeConnections } from '@xyflow/react';
import clsx from 'clsx';
import { useAtom, useAtomValue } from 'jotai';

export const NandNode = (props: NodeProps<'nand'>) => {
  const { atoms } = props.data;

  const out = useAtomValue(atoms.outputAtoms.out);
  useAtom(atoms.effectAtom);

  const connections = useNodeConnections();

  // 최적화 필요
  // 애초에 useConnection에서 나에게로 오는 것만 반환하게
  const in1Connections = connections.filter(
    (connection) =>
      connection.target === props.id && connection.targetHandle === 'in1',
  );
  const in2Connections = connections.filter(
    (connection) =>
      connection.target === props.id && connection.targetHandle === 'in2',
  );

  const backgroundColor = (() => {
    switch (out) {
      case null:
        return '';
      case false:
        return 'bg-red-500';
      case true:
        return 'bg-green-500';
    }
  })();

  return (
    <div
      className={clsx(
        'relative w-24 h-16 border rounded-r-full border-white box-content flex items-center justify-center',
        backgroundColor,
        props.selected && 'scale-110',
      )}
    >
      <Handle
        type="target"
        position={Position.Left}
        id="in1"
        style={{ top: '25%' }}
        isConnectable={in1Connections.length === 0}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="in2"
        style={{ top: '75%' }}
        isConnectable={in2Connections.length === 0}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="out"
        style={{
          border: '1px solid white',
          top: '50%',
          transform: 'translateY(-50%) translateX(100%)',
          width: '16px',
          height: '16px',
          backgroundColor: 'transparent',
        }}
      />
      {/* 생긴게 치우치게 생겨서 중심 미세조정 */}
      <p className="text-white text-2xl font-semibold mr-[5px]">
        {out ? 1 : 0}
      </p>
    </div>
  );
};
