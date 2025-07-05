import { Handle, Position, useNodeConnections } from '@xyflow/react';
import { useAtom, useAtomValue } from 'jotai';
import type { NodeProps } from '@/components/cs/flow/components/type';
import {
	LEFT_HANDLE_STYLE,
	RIGHT_HANDLE_STYLE,
} from '@/components/cs/flow/constants';

export const NorNode = ({ id, data, selected }: NodeProps<'nor'>) => {
	const { atoms } = data;

	const out = useAtomValue(atoms.outputAtoms.out);
	useAtom(atoms.effectAtom);

	const connections = useNodeConnections();

	// 최적화 필요
	// 애초에 useConnection에서 나에게로 오는 것만 반환하게
	const in1Connections = connections.filter(
		(connection) => connection.target === id && connection.targetHandle === 'in1',
	);
	const in2Connections = connections.filter(
		(connection) => connection.target === id && connection.targetHandle === 'in2',
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
			<svg
				width='104'
				height='64'
				viewBox='0 0 104 64'
				xmlns='http://www.w3.org/2000/svg'
				role='img'
				aria-labelledby='orGateTitle'
				className={backgroundColor}
			>
				<title id='orGateTitle'>NOR Gate</title>
				<path
					d='M0,0 Q85,0 96,32 Q85,64 0,64 Q8,32 0,0 Z'
					stroke='currentColor'
					strokeWidth={selected ? 2 : 1}
				/>
				<circle
					cx='96'
					cy='32'
					r='8'
					stroke='currentColor'
					strokeWidth={selected ? 2 : 1}
				/>
			</svg>
			<Handle
				type='target'
				position={Position.Left}
				id='in1'
				style={{
					...LEFT_HANDLE_STYLE,
					top: '25%',
				}}
				isConnectable={in1Connections.length === 0}
			/>
			<Handle
				type='target'
				position={Position.Left}
				id='in2'
				style={{
					...LEFT_HANDLE_STYLE,
					top: '75%',
				}}
				isConnectable={in2Connections.length === 0}
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
