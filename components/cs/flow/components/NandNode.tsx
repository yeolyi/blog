import { Handle, Position, useNodeConnections } from '@xyflow/react';
import clsx from 'clsx';
import { useAtom, useAtomValue } from 'jotai';
import type { NodeProps } from '@/components/cs/flow/components/type';
import {
	LEFT_HANDLE_STYLE,
	RIGHT_HANDLE_STYLE,
} from '@/components/cs/flow/constants';

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
				'relative w-24 h-16 rounded-r-full box-content flex items-center justify-center outline outline-black dark:outline-white',
				backgroundColor,
				props.selected ? 'outline-2' : 'outline-1',
			)}
		>
			<div
				className={clsx(
					'absolute right-0 translate-x-[12px] rounded-full top-1/2 -translate-y-1/2 w-[16px] h-[16px] outline outline-black dark:outline-white',
					backgroundColor,
				)}
			/>
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
					right: '-12px',
				}}
			/>
			{/* 생긴게 치우치게 생겨서 중심 미세조정 */}
			<p className='text-foreground text-2xl font-semibold mr-[5px]'>
				{out === true ? 1 : out === false ? 0 : ''}
			</p>
		</div>
	);
};
