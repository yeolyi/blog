'use client';

import {
  allTagsAtom,
  updateMemeAtom,
} from '@/app/[locale]/memes/store/memeStore';
import type { Meme } from '@/types/meme';
import { useAtom, useSetAtom } from 'jotai';
import { Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { updateMeme } from '../../actions';

interface MemeEditFormProps {
  meme: Meme;
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormValues {
  title: string;
  tagInput: string;
  hidden: boolean;
}

export default function MemeEditForm({
  meme,
  onSuccess,
  onCancel,
}: MemeEditFormProps) {
  const updateMemeInStore = useSetAtom(updateMemeAtom);
  const [allTags] = useAtom(allTagsAtom);
  const [currentTags, setCurrentTags] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError: setFormError,
    setValue,
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      title: meme.title,
      tagInput: meme.meme_tags.map((tag) => tag.tags.name).join(', '),
      hidden: meme.hidden,
    },
  });

  const tagInput = watch('tagInput');

  useEffect(() => {
    const tags = tagInput
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    setCurrentTags(tags);
  }, [tagInput]);

  const handleTagClick = (tagName: string) => {
    // 이미 태그가 있는지 확인
    if (currentTags.includes(tagName)) {
      // 이미 태그가 있으면 제거
      const filteredTags = currentTags.filter((tag) => tag !== tagName);
      setValue('tagInput', filteredTags.join(', '));
      return;
    }

    // 기존 태그에 새 태그 추가
    const newTagInput =
      currentTags.length > 0 ? `${tagInput.trim()}, ${tagName}` : tagName;

    setValue('tagInput', newTagInput);
  };

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

      const result = await updateMeme({
        id: meme.id,
        title: data.title.trim(),
        tags: tagsList,
        hidden: data.hidden,
      });

      // 서버에서 반환된 데이터로 스토어 업데이트
      if (result.meme) {
        updateMemeInStore(result.meme);
      }

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

        {/* 태그 목록 */}
        <div className="mt-2">
          <p className="text-sm text-gray-400 mb-1">기존 태그 클릭하여 추가</p>
          <div className="flex flex-wrap gap-1">
            {allTags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => handleTagClick(tag.name)}
                className={`text-xs px-2 py-1 rounded bg-[#444] hover:bg-[#555] ${
                  currentTags.includes(tag.name)
                    ? 'border border-blue-500 text-blue-300'
                    : 'text-gray-300'
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
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
