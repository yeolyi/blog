'use client';
import { login } from '@/db/auth';
import { createComment } from '@/db/comment/create';
import type { Profile } from '@/types/helper.types';
import { getErrMessage } from '@/utils/string';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { mutate } from 'swr';

type CommentFormProps = {
  postId: string;
  profile: Profile | null;
};

type FormData = {
  content: string;
};

export default function CommentForm({ postId, profile }: CommentFormProps) {
  const t = useTranslations('Comment');

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<{ content: string }>({ defaultValues: { content: '' } });

  const onSubmit = async (values: FormData) => {
    const trimmedContent = values.content.trim();
    if (!trimmedContent) return;
    if (!profile) return;

    try {
      await createComment(postId, trimmedContent, profile.id);
      mutate('comments');
      reset();
    } catch (e) {
      setError('root', { message: getErrMessage(e) });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit(onSubmit)();
    }
  };

  if (!profile) {
    return (
      <p className="p-4 border border-[#5E5E5E] text-gray-300">
        {t.rich('loginRequired', {
          loginLink: (chunks) => (
            <button
              className="underline cursor-pointer"
              type="button"
              onClick={login}
            >
              {chunks}
            </button>
          ),
        })}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 relative">
      <textarea
        {...register('content', { required: t('required') })}
        disabled={isSubmitting}
        onKeyDown={handleKeyDown}
        placeholder={t('placeholder')}
        className="block w-full resize-none min-h-32 p-3 border border-[#5E5E5E] focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-gray-100 overflow-hidden"
      />

      {errors.content && (
        <p className="absolute -top-2 -right-0 -translate-y-full text-orange-600 text-sm">
          {errors.content.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-4 py-2 bg-white text-black hover:bg-black hover:text-white focus:outline-none focus:ring-1 focus:ring-gray-500 focus:ring-offset-1 disabled:opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed cursor-pointer"
      >
        {isSubmitting ? t('submitting') : t('submit')}
      </button>
    </form>
  );
}
