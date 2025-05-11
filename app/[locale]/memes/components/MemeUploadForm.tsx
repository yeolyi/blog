'use client';
import { uploadSingleMeme } from '@/app/[locale]/memes/actions';
import { getMediaTypeFromFile } from '@/utils/form';
import { Save, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';

interface FormInputs {
  title: string;
  description: string;
  file: FileList;
  tags: string;
}

interface MemeUploadFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function MemeUploadForm({ onCancel }: MemeUploadFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError: setFormError,
  } = useForm<FormInputs>({
    defaultValues: {
      title: '',
      description: '',
      tags: '',
    },
  });
  const router = useRouter();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    const file = data.file[0];

    // 파일 타입 자동 감지
    const mediaType = getMediaTypeFromFile(file);

    // 타입에 맞는 파일인지 확인
    if (mediaType === 'image' && !file.type.startsWith('image/')) {
      setFormError('file', { message: '이미지 파일만 업로드 가능합니다' });
      return;
    }

    if (mediaType === 'video' && !file.type.startsWith('video/')) {
      setFormError('file', { message: '비디오 파일만 업로드 가능합니다' });
      return;
    }

    try {
      const file = data.file[0];

      await uploadSingleMeme({
        title: data.title,
        description: data.description,
        file,
        tags: data.tags,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';

      // 폼 전체 에러 설정
      setFormError('root', {
        type: 'manual',
        message: errorMessage,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {errors.root?.message && (
        <div className="bg-[#ffebee] text-[#c62828] p-4 rounded mb-4">
          <strong>오류:</strong> {errors.root.message}
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="title" className="block mb-2 font-bold text-white">
          제목 *
        </label>
        <input
          id="title"
          type="text"
          className="w-full p-2 rounded bg-[#333] text-white border border-[#555]"
          {...register('title', { required: '제목을 입력해주세요' })}
        />
        {errors.title && (
          <p className="text-[#ff4d4f] mt-1">{errors.title.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor="description"
          className="block mb-2 font-bold text-white"
        >
          설명 (선택사항)
        </label>
        <textarea
          id="description"
          className="w-full p-2 rounded bg-[#333] text-white border border-[#555] min-h-[100px]"
          {...register('description')}
          rows={3}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="file" className="block mb-2 font-bold text-white">
          파일 *
        </label>
        <input
          id="file"
          type="file"
          className="w-full p-2 text-white"
          {...register('file', { required: '파일을 선택해주세요' })}
          accept="image/*,video/*"
          onChange={handleFileChange}
        />
        {errors.file && (
          <p className="text-[#ff4d4f] mt-1">{errors.file.message}</p>
        )}

        {previewUrl && (
          <div className="mt-4 max-w-[300px] mx-auto">
            <img
              src={previewUrl}
              alt="미리보기"
              className="w-full h-auto object-contain rounded"
            />
          </div>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="tags" className="block mb-2 font-bold text-white">
          태그 (쉼표로 구분)
        </label>
        <input
          id="tags"
          type="text"
          className="w-full p-2 rounded bg-[#333] text-white border border-[#555]"
          {...register('tags')}
          placeholder="예: 재밌는, 귀여운, 대학생"
        />
      </div>

      <div className="flex justify-between mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="py-2 px-4 bg-[#555] text-white border-none rounded cursor-pointer flex items-center gap-2"
        >
          <X size={16} /> 취소
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="py-2 px-4 bg-[#4CAF50] text-white border-none rounded cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            '업로드 중...'
          ) : (
            <>
              <Save size={16} /> 업로드
            </>
          )}
        </button>
      </div>
    </form>
  );
}
