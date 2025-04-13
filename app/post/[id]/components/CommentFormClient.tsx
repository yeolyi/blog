'use client';

import { Eye, EyeOff } from 'lucide-react';
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 relative">
      <button
        type="button"
        onClick={() => setShowPreview((x) => !x)}
        className={`px-3 py-1 text-sm flex items-center gap-1 absolute top-2 right-2 cursor-pointer ${
          showPreview ? 'text-white' : 'text-[#5E5E5E]'
        }`}
      >
        {showPreview ? <Eye size={20} /> : <EyeOff size={20} />}
      </button>

      {!showPreview ? (
        <textarea
          {...register('content', {
            required: '내용을 입력해주세요.',
            minLength: {
              value: 2,
              message: '최소 2자 이상 입력해주세요.',
            },
          })}
          placeholder="댓글을 작성해보세요 (마크다운 지원)"
          className="block w-full min-h-32 h-fit resize-y p-3 border border-[#5E5E5E] focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 dark:text-gray-100"
          disabled={isSubmitting}
        />
      ) : (
        <div className="w-full min-h-32 p-3 border border-[#5E5E5E] overflow-auto">
          <div
            // biome-ignore lint/security/noDangerouslySetInnerHtml: 마크다운 렌더링을 위해 필요
            dangerouslySetInnerHTML={{ __html: preview }}
            className="prose prose-gray dark:prose-invert max-w-none"
          />
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
        className="w-full px-4 py-2 bg-white text-black hover:bg-black hover:text-white focus:outline-none focus:ring-1 focus:ring-gray-500 focus:ring-offset-1 disabled:opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed cursor-pointer"
      >
        {isSubmitting ? '작성 중...' : '댓글 작성'}
      </button>
    </form>
  );
}
