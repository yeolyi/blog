import dayjs from 'dayjs';
import { Check, Trash, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Fragment, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Link } from '@/i18n/navigation';
import { useProfile } from '@/swr/auth';
import { deleteComment, useComments } from '@/swr/comment';
import type { Comment } from '@/types/helper.types';

interface CommentListProps {
	postId: string;
}

export default function CommentList({ postId }: CommentListProps) {
	const { data: comments } = useComments(postId);

	return (
		<div className='flex flex-col gap-4'>
			{comments?.map((comment, index) => (
				<Fragment key={comment.id}>
					{index !== 0 && <Separator />}
					<CommentItem comment={comment} postId={postId} />
				</Fragment>
			))}
		</div>
	);
}

const CommentItem = ({
	comment,
	postId,
}: {
	comment: Comment;
	postId: string;
}) => {
	const commentT = useTranslations('Comment');
	const { data: profile } = useProfile();

	const githubId = comment.github_id;
	const githubUrl = githubId ? `https://github.com/${githubId}` : '#';
	const isAuthor = profile?.id === comment.author_id;

	return (
		<div className='relative'>
			<p>
				<Button variant='link' asChild className='pl-0'>
					<Link href={githubUrl} target='_blank' rel='noopener noreferrer'>
						{commentT('developer', { number: comment.developernumber })}
					</Link>
				</Button>
				<span className='text-muted-foreground'>
					{dayjs(comment.created_at).format(commentT('dateFormat'))}
				</span>
			</p>

			<p>{comment.content}</p>

			{isAuthor && <DeleteButton postId={postId} commentId={comment.id} />}
		</div>
	);
};

const DeleteButton = ({
	postId,
	commentId,
}: {
	postId: string;
	commentId: string;
}) => {
	const [asked, setAsked] = useState(false);

	if (asked) {
		return (
			<div className='flex absolute top-0 right-0'>
				<Button
					type='button'
					onClick={() => setAsked(false)}
					size='icon'
					variant='ghost'
				>
					<X />
				</Button>
				<Button
					type='button'
					onClick={() => deleteComment(postId, commentId)}
					size='icon'
					variant='ghost'
				>
					<Check />
				</Button>
			</div>
		);
	}

	return (
		<Button
			type='button'
			onClick={() => setAsked(true)}
			variant='ghost'
			size='icon'
			className='absolute top-0 right-0'
		>
			<Trash />
		</Button>
	);
};
