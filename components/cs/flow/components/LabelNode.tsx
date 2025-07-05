import { Handle, Position, useNodeConnections } from '@xyflow/react';
import clsx from 'clsx';
import { useAtom, useAtomValue } from 'jotai';
import NameTag from '@/components/cs/flow/components/NameTag';
import type { NodeProps } from '@/components/cs/flow/components/type';
import { LEFT_HANDLE_STYLE } from '@/components/cs/flow/constants';

export const LabelNode = (props: NodeProps<'label'>) => {
	const { atoms } = props.data;

	const out = useAtomValue(atoms.outputAtoms.out);
	useAtom(atoms.effectAtom);

	const connections = useNodeConnections();

	// 최적화 필요
	// 애초에 useConnection에서 나에게로 오는 것만 반환하게
	const inConnection = connections.filter(
		(connection) =>
			connection.target === props.id && connection.targetHandle === 'in1',
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
				'relative w-10 h-10 box-content rounded-full flex items-center justify-center outline outline-black dark:outline-white',
				backgroundColor,
				props.selected ? 'outline-2' : 'outline-1',
			)}
		>
			<Handle
				type='target'
				position={Position.Left}
				id='in'
				style={{
					...LEFT_HANDLE_STYLE,
					top: '50%',
				}}
				isConnectable={inConnection.length === 0}
			/>
			{/* 생긴게 치우치게 생겨서 중심 미세조정 */}
			<p className='text-foreground text-2xl font-semibold'>
				{out === true ? 1 : out === false ? 0 : ''}
			</p>
			<NameTag atom={atoms.outputAtoms.label} />
		</div>
	);
};
