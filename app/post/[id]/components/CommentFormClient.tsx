'use client';

import { Paintbrush } from 'lucide-react';
import { useEffect, useState } from 'react';
import { type UseFormRegisterReturn, useForm } from 'react-hook-form';
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit(onSubmit)();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 relative">
      <button
        type="button"
        onClick={() => setShowPreview((x) => !x)}
        className={`px-3 py-1 text-sm flex items-center gap-1 absolute top-2 right-2 cursor-pointer ${
          showPreview ? 'text-white' : 'text-[#5E5E5E] hover:text-gray-400'
        }`}
      >
        <Paintbrush size={20} />
      </button>

      {!showPreview ? (
        <FitTextArea
          {...register('content', {
            required: '내용을 입력해주세요.',
          })}
          disabled={isSubmitting}
          onKeyDown={handleKeyDown}
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

const FitTextArea = (
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement> &
    UseFormRegisterReturn,
) => {
  return (
    <textarea
      {...props}
      ref={(ref) => {
        if (!ref) return;
        if (props.ref) {
          props.ref(ref);
        }

        const handleInput = () => {
          // textarea.style.height = 'auto'가 필요한 이유는,
          // 행의 수가 줄어드는 경우에는 scrollHeight가 변하지 않기 때문이다.
          // height를 auto로 설정해줌으로써 overflow를 강제로 발생시킨다.
          // 이로부터 원하는 textarea의 scrollHeight를 얻어내는 것이다.
          ref.style.height = 'auto';
          ref.style.height = `${ref.scrollHeight}px`;
        };

        handleInput();

        ref.addEventListener('input', handleInput);
        return () => ref.removeEventListener('input', handleInput);
      }}
      placeholder="댓글을 작성해보세요 (마크다운 지원)"
      className="block w-full resize-none min-h-32 p-3 border border-[#5E5E5E] focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 dark:text-gray-100 overflow-hidden"
    />
  );
};
