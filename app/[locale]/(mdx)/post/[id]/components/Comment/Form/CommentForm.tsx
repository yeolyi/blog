'use client';

import {
  createComment,
  toggleEmojiReaction,
} from '@/app/[locale]/(mdx)/post/[id]/actions';
import { renderMarkdown } from '@/app/[locale]/(mdx)/post/[id]/utils/markdown';
import { isSingleEmoji } from '@/utils/string';
import { Paintbrush } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { type UseFormRegisterReturn, useForm, useWatch } from 'react-hook-form';
import LoginButton from './LoginButton';

type CommentFormProps = {
  postId: string;
  isLoggedIn: boolean;
};

type FormData = {
  content: string;
};

export default function CommentForm({ postId, isLoggedIn }: CommentFormProps) {
  const t = useTranslations('Comment');
  const [serverError, setServerError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting, errors },
  } = useForm<{ content: string }>({ defaultValues: { content: '' } });

  const content = useWatch({ control, name: 'content' });

  useEffect(() => {
    if (!content || !showPreview) return;
    (async () => {
      const renderedContent = await renderMarkdown(content);
      setPreview(renderedContent);
    })();
  }, [content, showPreview]);

  const onSubmit = async (values: FormData) => {
    const trimmedContent = values.content.trim();
    if (!trimmedContent) return;

    setServerError(null);

    try {
      const formData = new FormData();
      formData.append('postId', postId);
      formData.append('content', values.content);

      // 단일 이모지인 경우 이모지 액션으로 처리
      if (isSingleEmoji(trimmedContent)) {
        const result = await toggleEmojiReaction({
          postId,
          emoji: values.content,
        });

        if (result.error) {
          setServerError(result.error);
        } else if (result.success) {
          reset(); // 폼 초기화
          setPreview('');
          setShowPreview(false);
        }
      } else {
        // 일반 댓글 처리
        const result = await createComment(formData);

        if (result.error) {
          setServerError(result.error);
        } else if (result.success) {
          reset(); // 폼 초기화
          setPreview('');
          setShowPreview(false);
        }
      }
    } catch (e) {
      setServerError(t('submitError'));
      console.error('댓글 작성 에러:', e);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit(onSubmit)();
    }
  };

  if (!isLoggedIn) {
    return <AskLoginLabel />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 relative">
      <div className="flex items-center gap-2 absolute top-2 right-2">
        <button
          type="button"
          onClick={() => setShowPreview((x) => !x)}
          className={`text-sm cursor-pointer w-6 h-6 ${
            showPreview ? 'text-white' : 'text-[#5E5E5E] hover:text-gray-400'
          }`}
        >
          <Paintbrush size={20} />
        </button>
      </div>

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
            className="prose prose-gray prose-invert max-w-none"
          />
        </div>
      )}

      {errors.content && (
        <p className="text-gray-300 text-sm">{errors.content.message}</p>
      )}

      {serverError && <p className="text-gray-300 text-sm">{serverError}</p>}

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

const FitTextArea = (
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement> &
    UseFormRegisterReturn,
) => {
  const t = useTranslations('Comment');

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
      placeholder={t('placeholder')}
      className="block w-full resize-none min-h-32 p-3 border border-[#5E5E5E] focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-gray-100 overflow-hidden"
    />
  );
};

const AskLoginLabel = () => {
  const t = useTranslations('Comment');

  return (
    <p className="p-4 border border-[#5E5E5E] text-gray-300">
      {t.rich('loginRequired', {
        loginLink: (chunks) => <LoginButton>{chunks}</LoginButton>,
      })}
    </p>
  );
};
