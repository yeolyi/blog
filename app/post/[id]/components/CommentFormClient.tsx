'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface CommentFormClientProps {
  postId: string;
  createAction: (
    formData: FormData,
  ) => Promise<{ success?: boolean; error?: string }>;
}

interface CommentFormValues {
  content: string;
}

export function CommentFormClient({
  postId,
  createAction,
}: CommentFormClientProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<CommentFormValues>({
    defaultValues: {
      content: '',
    },
  });

  const onSubmit = async (values: CommentFormValues) => {
    if (!values.content.trim()) return;

    setServerError(null);

    try {
      const formData = new FormData();
      formData.append('postId', postId);
      formData.append('content', values.content);

      const result = await createAction(formData);

      if (result.error) {
        setServerError(result.error);
      } else if (result.success) {
        reset(); // 폼 초기화
      }
    } catch (e) {
      setServerError('댓글 작성 중 오류가 발생했습니다.');
      console.error('댓글 작성 에러:', e);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <textarea
        {...register('content', {
          required: '내용을 입력해주세요.',
          minLength: {
            value: 2,
            message: '최소 2자 이상 입력해주세요.',
          },
        })}
        placeholder="댓글을 작성해주세요..."
        className="w-full min-h-24 resize-y p-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
        disabled={isSubmitting}
      />

      {errors.content && (
        <p className="text-gray-700 dark:text-gray-300 text-sm">
          {errors.content.message}
        </p>
      )}

      {serverError && (
        <p className="text-gray-700 dark:text-gray-300 text-sm">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 bg-gray-800 text-white border border-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:ring-offset-1 disabled:opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed dark:bg-gray-700 dark:hover:bg-gray-600"
      >
        {isSubmitting ? '작성 중...' : '댓글 작성'}
      </button>
    </form>
  );
}
