'use client';
import { Pencil } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useActionState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useProfile } from '@/swr/auth';
import { createComment, useComments } from '@/swr/comment';
import { getErrMessage } from '@/utils/string';

type CommentFormProps = {
	postId: string;
};

export default function CommentForm({ postId }: CommentFormProps) {
	const { data: profile } = useProfile();
	const { data: comments } = useComments(postId);
	const t = useTranslations('Comment');

	const isCommentEmpty = comments?.length === 0;

	const onSubmit = async (_prevState: string | undefined, values: FormData) => {
		const content = values.get('content');
		if (typeof content !== 'string') return;

		try {
			if (!profile) return '유저 아이디를 불러올 수 없어요';
			await createComment(postId, content, profile.id);
		} catch (e) {
			toast.error(getErrMessage(e));
			return '';
		}

		return;
	};

	const [state, formAction, isPending] = useActionState(onSubmit, undefined);

	return (
		<form action={formAction} className='relative'>
			{state && (
				<p className='absolute right-0 -top-1 -translate-y-full text-orange-600'>
					{state}
				</p>
			)}
			<Textarea
				name='content'
				placeholder={`${t('placeholder')} ${isCommentEmpty ? t('noComments') : ''}`}
				className='resize-none min-h-32'
				defaultValue=''
				required
			/>
			<Button
				type='submit'
				variant='secondary'
				disabled={isPending}
				className='absolute bottom-4 right-4'
			>
				<Pencil />
				{isPending ? t('submitting') : t('submit')}
			</Button>
		</form>
	);
}
