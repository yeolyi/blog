'use client';

import Button from '@/app/[locale]/components/ui/Button';
import LabelForm from '@/app/[locale]/memes/components/LabelForm';
import {
  allTagsAtom,
  updateMemeAtom,
} from '@/app/[locale]/memes/store/memeStore';
import type { Meme } from '@/types/meme';
import { useAtom, useSetAtom } from 'jotai';
import { Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { updateMeme } from '../actions';

interface MemeEditFormProps {
  meme: Meme;
  onSuccess?: () => void;
  onCancel?: () => void;
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

  const formMethods = useForm<FormValues>({
    defaultValues: {
      title: meme.title ?? '',
      tagInput: meme.meme_tags.map((tag) => tag.tags.name).join(', '),
      hidden: meme.hidden,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError: setFormError,
    setValue,
    watch,
  } = formMethods;

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
      onSuccess?.();
    } catch (err) {
      console.error('수정 중 오류:', err);
      setFormError('root', {
        message:
          err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다',
      });
    }
  };

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        <LabelForm title="제목" registerName="title" />

        <div className="flex gap-2 flex-col">
          <LabelForm
            title="태그"
            placeholder="태그1, 태그2, 태그3"
            registerName="tagInput"
            autoFocus
          />

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

        <div className="flex items-center gap-2">
          <input
            id="hidden"
            type="checkbox"
            className="h-4 w-4"
            {...register('hidden')}
          />
          <label htmlFor="hidden" className="flex items-center text-white">
            숨김
          </label>
        </div>

        <div className="flex gap-4 justify-end">
          <Button
            theme="gray"
            type="button"
            onClick={onCancel}
            icon={<X size={16} />}
          >
            취소
          </Button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="py-2 px-4 bg-[#4CAF50] text-white border-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save size={16} /> 저장
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
