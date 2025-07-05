import { Handle, Position, useNodeConnections } from '@xyflow/react';
import { useAtom, useAtomValue } from 'jotai';
import type { NodeProps } from '@/components/cs/flow/components/type';
import {
	LEFT_HANDLE_STYLE,
	RIGHT_HANDLE_STYLE,
} from '@/components/cs/flow/constants';

export const NotNode = ({ id, data, selected }: NodeProps<'not'>) => {
	const { atoms } = data;

	const out = useAtomValue(atoms.outputAtoms.out);
	useAtom(atoms.effectAtom);

	const connections = useNodeConnections();

	// 최적화 필요
	// 애초에 useConnection에서 나에게로 오는 것만 반환하게
	const in1Connections = connections.filter(
		(connection) => connection.target === id && connection.targetHandle === 'in1',
	);

	const backgroundColor = (() => {
		switch (out) {
			case null:
				// svg라서 그런가 명시 안하니까 검은색이 되네
				return 'fill-transparent';
			case false:
				return 'fill-red-500';
			case true:
				return 'fill-green-500';
		}
	})();

	return (
		<div className='relative text-foreground'>
			<svg width='48' height='40' viewBox='0 0 48 40'>
				<title id='orGateTitle'>NOT Gate</title>
				<path
					d='M0 0 L40 20 L0 40 Z'
					className={backgroundColor}
					stroke='currentColor'
					strokeWidth={selected ? 2 : 1}
				/>
				<circle
					cx='40'
					cy='20'
					r='8'
					stroke='currentColor'
					className={backgroundColor}
				/>
			</svg>
			<Handle
				type='target'
				position={Position.Left}
				className='outline-black dark:outline-white'
				id='in1'
				style={{
					...LEFT_HANDLE_STYLE,
					top: '50%',
				}}
				isConnectable={in1Connections.length === 0}
			/>
			<Handle
				type='source'
				position={Position.Right}
				id='out'
				style={{
					...RIGHT_HANDLE_STYLE,
					top: '50%',
				}}
			/>
		</div>
	);
};
