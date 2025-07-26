'use client';
import dynamic from 'next/dynamic';
import NeedLogin from '@/components/comment/NeedLogin';
import { cn } from '@/lib/utils';
import { useSessionStore } from '@/store/session';
import CommentForm from './Form';
import CommentList from './Viewer';

const HeartPhysics = dynamic(() => import('./HeartPhysics'));

export default function Comment({
	postId,
	className,
}: {
	postId: string;
	className?: string;
}) {
	const session = useSessionStore((state) => state.session);

	return (
		<div className={cn('relative space-y-7', className)}>
			<HeartPhysics sessionId={session?.user?.id} postId={postId} />
			{session ? <CommentForm postId={postId} /> : <NeedLogin />}
			<CommentList postId={postId} />
		</div>
	);
}
