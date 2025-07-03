import {
	type Edge,
	type Node,
	type ReactFlowInstance,
	useOnSelectionChange,
} from '@xyflow/react';
import {
	Folder,
	Lock,
	LockOpen,
	Maximize,
	Minus,
	Plus,
	Save,
	Trash,
} from 'lucide-react';
import { useCallback, useState } from 'react';
import { minZoomOptions } from '@/components/cs/flow';
import { Button } from '@/components/ui/button';
import type { TouchDeviceState } from '../hooks/useMobileState';

interface ControlsProps {
	rfInstance: ReactFlowInstance | null;
	touchOnlyState: TouchDeviceState;
	setTouchOnlyState: (value: TouchDeviceState) => void;
	onSave: () => void;
	onRestore: () => void;
	onDeleteNode: (id: string) => void;
	onDeleteEdge: (id: string) => void;
}

export function Controls({
	rfInstance,
	touchOnlyState,
	setTouchOnlyState,
	onSave,
	onRestore,
	onDeleteNode,
	onDeleteEdge,
}: ControlsProps) {
	const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
	const [selectedEdges, setSelectedEdges] = useState<string[]>([]);

	const onChange = useCallback(
		({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) => {
			setSelectedNodes(nodes.map((node) => node.id));
			setSelectedEdges(edges.map((edge) => edge.id));
		},
		[],
	);

	useOnSelectionChange({ onChange });

	const onDelete = () => {
		for (const node of selectedNodes) {
			onDeleteNode(node);
		}
		for (const edge of selectedEdges) {
			onDeleteEdge(edge);
		}
	};

	if (touchOnlyState.type === 'loading') {
		return null;
	}

	return (
		<>
			{(touchOnlyState.type === 'desktop' ||
				(touchOnlyState.type === 'mobile' && touchOnlyState.value)) && (
				<div className='absolute top-0 left-0 right-0 flex justify-center z-10 pointer-events-none'>
					<div className='flex gap-5 m-2 p-2 pointer-events-auto'>
						<div className='flex gap-1'>
							{touchOnlyState.type === 'desktop' && (
								<>
									<Button
										variant='secondary'
										size='icon'
										onClick={() => rfInstance?.zoomIn()}
									>
										<Plus />
									</Button>
									<Button
										variant='secondary'
										size='icon'
										onClick={() => rfInstance?.zoomOut()}
									>
										<Minus />
									</Button>
								</>
							)}

							<Button
								variant='secondary'
								size='icon'
								onClick={() => rfInstance?.fitView(minZoomOptions)}
								disabled={touchOnlyState.type === 'mobile' && !touchOnlyState.value}
							>
								<Maximize />
							</Button>

							{touchOnlyState.type === 'mobile' && (
								<Button
									variant='secondary'
									size='icon'
									onClick={onDelete}
									disabled={
										!touchOnlyState.value ||
										(selectedNodes.length === 0 && selectedEdges.length === 0)
									}
								>
									<Trash />
								</Button>
							)}
						</div>

						<div className='flex gap-1'>
							<Button variant='secondary' size='icon' onClick={onSave}>
								<Save />
							</Button>
							<Button variant='secondary' size='icon' onClick={onRestore}>
								<Folder />
							</Button>
						</div>
					</div>
				</div>
			)}

			{touchOnlyState.type === 'mobile' && (
				<Button
					variant='secondary'
					size='icon'
					className='absolute right-0 bottom-0 z-10 m-2'
					onClick={() =>
						setTouchOnlyState({
							type: 'mobile',
							value: !touchOnlyState.value,
						})
					}
				>
					{touchOnlyState.value ? <LockOpen /> : <Lock />}
				</Button>
			)}
		</>
	);
}
