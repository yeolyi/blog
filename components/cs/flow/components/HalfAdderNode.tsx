import { Handle, Position, useNodeConnections } from '@xyflow/react';
import clsx from 'clsx';
import { useAtom, useAtomValue } from 'jotai';
import type { NodeProps } from '@/components/cs/flow/components/type';
import {
	LEFT_HANDLE_STYLE,
	RIGHT_HANDLE_STYLE,
} from '@/components/cs/flow/constants';
import type { OutputValue } from '@/components/cs/flow/model/type';

export const HalfAdderNode = (props: NodeProps<'halfAdder'>) => {
	const { atoms } = props.data;

	const sum = useAtomValue(atoms.outputAtoms.sum);
	const carry = useAtomValue(atoms.outputAtoms.carry);
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
				id='in1'
				style={{ ...LEFT_HANDLE_STYLE, top: '25%' }}
				isConnectable={in1Connections.length === 0}
			/>
			<Handle
				type='target'
				position={Position.Left}
				id='in2'
				style={{ ...LEFT_HANDLE_STYLE, top: '75%' }}
				isConnectable={in2Connections.length === 0}
			/>
			<Handle
				type='source'
				position={Position.Right}
				id='sum'
				style={{ ...RIGHT_HANDLE_STYLE, top: '25%' }}
			/>
			<Handle
				type='source'
				position={Position.Right}
				id='carry'
				style={{ ...RIGHT_HANDLE_STYLE, top: '75%' }}
			/>

			<p
				className={clsx(
					'absolute top-1 right-1 text-sm font-mono',
					valueToColor(sum),
				)}
			>
				SUM
			</p>
			<p
				className={clsx(
					'absolute bottom-1 right-1 text-sm font-mono',
					valueToColor(carry),
				)}
			>
				CARRY
			</p>
			<p className='absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-foreground text-base text-center'>
				HALF ADDER
			</p>
		</div>
	);
};
