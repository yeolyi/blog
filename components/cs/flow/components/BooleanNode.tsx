import { Handle, Position } from '@xyflow/react';
import clsx from 'clsx';
import { useAtom } from 'jotai';
import NameTag from '@/components/cs/flow/components/NameTag';
import type { NodeProps } from '@/components/cs/flow/components/type';
import { RIGHT_HANDLE_STYLE } from '@/components/cs/flow/constants';

export const BooleanNode = (props: NodeProps<'number'>) => {
	const { atoms } = props.data;
	const [out, setOut] = useAtom(atoms.outputAtoms.out);

	return (
		<div className='relative'>
			<button
				className={clsx(
					'relative w-10 h-10 outline outline-black dark:outline-white cursor-pointer',
					out ? 'bg-green-500' : 'bg-red-500',
					props.selected ? 'outline-2' : 'outline-1',
				)}
				onClick={() => setOut(!out)}
				type='button'
			>
				<p className='text-foreground text-2xl font-semibold'>{out ? 1 : 0}</p>
				<Handle
					type='source'
					position={Position.Right}
					id='out'
					style={{ ...RIGHT_HANDLE_STYLE, top: '50%' }}
				/>
			</button>
			<NameTag atom={atoms.outputAtoms.label} />
		</div>
	);
};
