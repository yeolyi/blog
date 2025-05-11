'use client';

import { useMemeStore } from '@/app/[locale]/memes/store/memeStore';
import type { Meme } from '@/types/meme';
import { Save, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { updateMeme } from '../actions';

interface MemeEditFormProps {
  meme: Meme;
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormValues {
  title: string;
  description: string;
  tagInput: string;
  hidden: boolean;
}

export default function MemeEditForm({
  meme,
  onSuccess,
  onCancel,
}: MemeEditFormProps) {
  const updateMemeInStore = useMemeStore((state) => state.updateMeme);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError: setFormError,
  } = useForm<FormValues>({
    defaultValues: {
      title: meme.title,
      description: meme.description || '',
      tagInput: meme.meme_tags.map((tag) => tag.tags.name).join(', '),
      hidden: meme.hidden,
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!data.title.trim()) {
      setFormError('title', { message: '제목은 필수입니다' });
      return;
    }

    try {
      const tagsList = data.tagInput
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      await updateMeme({
        id: meme.id,
        title: data.title.trim(),
        description: data.description.trim() || undefined,
        tags: tagsList,
        hidden: data.hidden,
      });

      // Zustand 스토어 업데이트
      const updatedMemeWithDetails: Meme = {
        ...meme,
        title: data.title.trim(),
        description: data.description.trim() || null,
        hidden: data.hidden,
        meme_tags: tagsList.map((tagName) => {
          // 기존 태그에서 같은 이름의 태그가 있으면 재사용, 아니면 새 태그로 취급
          const existingTag = meme.meme_tags.find(
            (t) => t.tags.name.toLowerCase() === tagName.toLowerCase(),
          );

          if (existingTag) {
            return existingTag;
          }

          // 새 태그의 경우 임시 ID 생성 (API 응답에서 실제 ID를 가져와야 함)
          return {
            tag_id: `temp-${Date.now()}-${Math.random()}`,
            tags: {
              id: `temp-${Date.now()}-${Math.random()}`,
              name: tagName,
            },
          };
        }),
      };

      updateMemeInStore(updatedMemeWithDetails);

      // UI 새로고침 없이 스토어의 상태만 업데이트
      onSuccess();
    } catch (err) {
      console.error('수정 중 오류:', err);
      setFormError('root', {
        message:
          err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {errors.root && (
        <div className="bg-[#ffebee] text-[#c62828] p-2 rounded">
          {errors.root.message}
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="title" className="block mb-2 font-bold text-white">
          제목 *
        </label>
        <input
          id="title"
          type="text"
          className={`w-full p-2 rounded bg-[#333] text-white border ${
            errors.title ? 'border-red-500' : 'border-[#555]'
          }`}
          {...register('title', { required: '제목은 필수입니다' })}
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor="description"
          className="block mb-2 font-bold text-white"
        >
          설명
        </label>
        <textarea
          id="description"
          className="w-full p-2 rounded bg-[#333] text-white border border-[#555] min-h-[100px]"
          {...register('description')}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="tagInput" className="block mb-2 font-bold text-white">
          태그 (쉼표로 구분)
        </label>
        <input
          id="tagInput"
          type="text"
          placeholder="태그1, 태그2, 태그3"
          className="w-full p-2 rounded bg-[#333] text-white border border-[#555]"
          // biome-ignore lint/a11y/noAutofocus: 내가 쓸거임
          autoFocus
          {...register('tagInput')}
        />
      </div>

      <div className="mb-4">
        <label className="flex items-center text-white">
          <input
            type="checkbox"
            className="mr-2 h-4 w-4"
            {...register('hidden')}
          />
          <span className="font-bold">숨김</span>
        </label>
      </div>

      <div className="flex justify-between mt-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="py-2 px-4 bg-[#555] text-white border-none rounded cursor-pointer flex items-center gap-2"
          >
            <X size={16} /> 취소
          </button>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="py-2 px-4 bg-[#4CAF50] text-white border-none rounded cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            '저장 중...'
          ) : (
            <>
              <Save size={16} /> 저장
            </>
          )}
        </button>
      </div>
    </form>
  );
}
