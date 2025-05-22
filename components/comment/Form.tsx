'use client';
import Button from '@/components/ui/Button';
import { useProfile } from '@/swr/auth';
import { createComment, useComments } from '@/swr/comment';
import { getErrMessage } from '@/utils/string';
import { Pencil } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useActionState } from 'react';

type CommentFormProps = {
  postId: string;
};

export default function CommentForm({ postId }: CommentFormProps) {
  const { data: profile } = useProfile();
  const { data: comments } = useComments(postId);
  const t = useTranslations('Comment');

  const isCommentEmpty = comments?.length === 0;

  const onSubmit = async (prevState: string | undefined, values: FormData) => {
    const content = values.get('content');
    if (typeof content !== 'string') return;

    try {
      if (!profile) return '유저 아이디를 불러올 수 없어요';
      await createComment(postId, content, profile.id);
    } catch (e) {
      return getErrMessage(e);
    }

    return;
  };

  const [state, formAction, isPending] = useActionState(onSubmit, undefined);

  return (
    <form action={formAction} className="space-y-3 relative">
      {state && (
        <p className="absolute right-0 -top-1 -translate-y-full text-orange-600">
          {state}
        </p>
      )}
      <textarea
        name="content"
        placeholder={`${t('placeholder')} ${
          isCommentEmpty ? t('noComments') : ''
        }`}
        className="block w-full resize-none min-h-32 p-3 border border-[#5E5E5E] focus:outline-none focus:ring-1 focus:ring-stone-500 focus:border-stone-500 text-gray-100 overflow-hidden"
        defaultValue=""
        required
      />
      <Button bg="gray" type="submit" disabled={isPending} Icon={Pencil}>
        {isPending ? t('submitting') : t('submit')}
      </Button>
    </form>
  );
}
