import { Handle, Position } from '@xyflow/react';
import clsx from 'clsx';
import { type PrimitiveAtom, useAtom } from 'jotai';

export type NumberNodeAtoms = {
  type: 'number';
  out: PrimitiveAtom<boolean>;
};

export const NumberNode = (props: {
  data: { atoms: NumberNodeAtoms };
  selected: boolean;
}) => {
  const { atoms } = props.data;
  const [out, setOut] = useAtom(atoms.out);

  return (
    <button
      className={clsx(
        'flex flex-col items-center justify-center relative w-12 h-12 border border-white cursor-pointer',
        out ? 'bg-green-500' : 'bg-red-500',
        props.selected && 'scale-110',
      )}
      onClick={() => setOut(!out)}
      type="button"
    >
      <p className="text-white text-2xl font-semibold">{out ? 1 : 0}</p>
      <Handle type="source" position={Position.Right} id="out" />
    </button>
  );
};
