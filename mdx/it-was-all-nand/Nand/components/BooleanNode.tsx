import type { NodeProps } from '@/mdx/it-was-all-nand/Nand/components';
import { Handle, Position } from '@xyflow/react';
import clsx from 'clsx';
import { useAtom } from 'jotai';

export const BooleanNode = (props: NodeProps<'number'>) => {
  const { atoms } = props.data;
  const [out, setOut] = useAtom(atoms.outputAtoms.out);

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
