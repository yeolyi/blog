'use client';
import clsx from 'clsx';
import NeedLogin from '@/components/comment/NeedLogin';
import { useSessionStore } from '@/store/session';
import Emoji from './Emoji';
import CommentForm from './Form';
import CommentList from './Viewer';

export default function Comment({
	postId,
	className,
}: {
	postId: string;
	className?: string;
}) {
	const session = useSessionStore((state) => state.session);

	return (
		<div className={clsx('space-y-7', className)}>
			<Emoji postId={postId} />
			{session ? <CommentForm postId={postId} /> : <NeedLogin />}
			<CommentList postId={postId} />
		</div>
	);
}
