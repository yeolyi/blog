'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { renderMarkdown } from '../utils/markdown';

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
  const [preview, setPreview] = useState<string>('');
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<CommentFormValues>({
    defaultValues: {
      content: '',
    },
  });

  const content = watch('content');

  useEffect(() => {
    const updatePreview = async () => {
      if (content && showPreview) {
        const renderedContent = await renderMarkdown(content);
        setPreview(renderedContent);
      }
    };
    updatePreview();
  }, [content, showPreview]);

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
        setPreview('');
        setShowPreview(false);
      }
    } catch (e) {
      setServerError('댓글 작성 중 오류가 발생했습니다.');
      console.error('댓글 작성 에러:', e);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="flex gap-2 mb-1">
        <button
          type="button"
          onClick={() => setShowPreview(false)}
          className={`px-3 py-1 text-sm ${
            !showPreview
              ? 'bg-gray-800 text-white dark:bg-gray-700'
              : 'bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
          }`}
        >
          작성
        </button>
        <button
          type="button"
          onClick={() => setShowPreview(true)}
          className={`px-3 py-1 text-sm ${
            showPreview
              ? 'bg-gray-800 text-white dark:bg-gray-700'
              : 'bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
          }`}
        >
          미리보기
        </button>
      </div>

      {!showPreview ? (
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
      ) : (
        <div className="w-full min-h-24 p-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-auto">
          {preview ? (
            <div
              // biome-ignore lint/security/noDangerouslySetInnerHtml: 마크다운 렌더링을 위해 필요
              dangerouslySetInnerHTML={{ __html: preview }}
              className="prose prose-gray dark:prose-invert max-w-none"
            />
          ) : (
            <p className="text-gray-400 dark:text-gray-500">
              미리보기 내용이 여기에 표시됩니다...
            </p>
          )}
        </div>
      )}

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
