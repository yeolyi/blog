import { Handle, Position, useNodeConnections } from '@xyflow/react';
import clsx from 'clsx';
import { useAtom, useAtomValue } from 'jotai';
import type { NodeProps } from '@/components/cs/flow/components/type';
import {
	LEFT_HANDLE_STYLE,
	RIGHT_HANDLE_STYLE,
} from '@/components/cs/flow/constants';
import type { OutputValue } from '@/components/cs/flow/model/type';

export const DLatchNode = (props: NodeProps<'dLatch'>) => {
	const { atoms } = props.data;

	const q = useAtomValue(atoms.outputAtoms.q);
	const qBar = useAtomValue(atoms.outputAtoms.qBar);
	useAtom(atoms.effectAtom);

	const connections = useNodeConnections();

	const dConnections = connections.filter(
		(connection) =>
			connection.target === props.id && connection.targetHandle === 'd',
	);
	const eConnections = connections.filter(
		(connection) =>
			connection.target === props.id && connection.targetHandle === 'e',
	);

	const valueToColor = (value: OutputValue | null) => {
		if (value === null) return 'text-foreground';
		return value ? 'text-green-500' : 'text-red-500';
	};

	return (
		<div
			className={clsx(
				'relative w-32 h-32 box-content flex items-center justify-center outline outline-black dark:outline-white',
				props.selected ? 'outline-2' : 'outline-1',
			)}
		>
			<Handle
				type='target'
				position={Position.Left}
				id='d'
				style={{ ...LEFT_HANDLE_STYLE, top: '25%' }}
				isConnectable={dConnections.length === 0}
			/>
			<Handle
				type='target'
				position={Position.Left}
				id='e'
				style={{ ...LEFT_HANDLE_STYLE, top: '75%' }}
				isConnectable={eConnections.length === 0}
			/>
			<Handle
				type='source'
				position={Position.Right}
				id='q'
				style={{ ...RIGHT_HANDLE_STYLE, top: '25%' }}
			/>
			<Handle
				type='source'
				position={Position.Right}
				id='qBar'
				style={{ ...RIGHT_HANDLE_STYLE, top: '75%' }}
			/>

			<p className='absolute top-1 left-1 text-sm font-mono text-foreground'>D</p>
			<p className='absolute bottom-1 left-1 text-sm font-mono text-foreground'>
				E
			</p>

			<p
				className={clsx(
					'absolute top-1 right-1 text-sm font-mono',
					valueToColor(q),
				)}
			>
				Q
			</p>
			<p
				className={clsx(
					'absolute bottom-1 right-1 text-sm font-mono',
					valueToColor(qBar),
				)}
			>
				Q_BAR
			</p>
			<p className='absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-foreground text-base text-center'>
				D LATCH
			</p>
		</div>
	);
};
