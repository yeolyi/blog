'use client';

import { uploadMemes } from '@/app/[locale]/memes/actions';
import type { Meme } from '@/types/meme';
import { Save, Upload, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';

export const maxDuration = 60;

interface FormInputs {
  memesJson: string;
}

interface BatchUploaderProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const textareaPlaceholder = `[
  {
    "title": "재밌는 밈",
    "description": "설명 (선택사항)",
    "media_url": "https://example.com/image.jpg",
    "tags": ["웃긴", "귀여운"]
  }
]`;

export default function BatchUploader({
  onSuccess,
  onCancel,
}: BatchUploaderProps) {
  const [errors, setErrors] = useState<string[]>([]);
  const [processedCount, setProcessedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      setErrors([]);
      setProcessedCount(0);
      setCurrentIndex(0);
      setIsProcessing(true);

      // JSON 파싱
      let memes: Meme[];
      try {
        memes = JSON.parse(data.memesJson);
        if (!Array.isArray(memes)) {
          throw new Error('JSON 데이터가 배열 형식이 아닙니다');
        }
      } catch (error) {
        setErrors([`JSON 파싱 오류: ${(error as Error).message}`]);
        setIsProcessing(false);
        return;
      }

      setTotalCount(memes.length);
      await uploadMemes(memes);
      setIsProcessing(false);
      router.refresh();

      if (!isProcessing && isSubmitSuccessful) {
        setTimeout(() => {
          onSuccess();
        }, 2000); // 완료 후 2초 후에 모달 닫기
      }
    } catch (error) {
      setErrors([(error as Error).message]);
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    reset();
    setErrors([]);
    setProcessedCount(0);
    setCurrentIndex(0);
    setTotalCount(0);
  };

  return (
    <div className="flex flex-col gap-4">
      {!isProcessing && !isSubmitSuccessful ? (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="memesJson"
              className="block mb-2 font-bold text-white"
            >
              밈 JSON 배열
            </label>
            <textarea
              id="memesJson"
              rows={10}
              className="w-full p-2 rounded bg-[#333] text-white border border-[#555] font-mono text-sm"
              placeholder={textareaPlaceholder}
              {...register('memesJson', {
                required: 'JSON 데이터를 입력하세요',
              })}
            />
            {formErrors.memesJson && (
              <p className="mt-1 text-[#ff4d4f]">
                {formErrors.memesJson.message?.toString() || ''}
              </p>
            )}
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
                  <Upload size={16} /> 업로드 시작
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-white">
            {!isProcessing ? '업로드 완료' : '업로드 진행 중...'}
          </h2>

          <div className="mt-2">
            <div className="w-full bg-[#555] rounded-full h-2.5">
              <div
                className="bg-[#4CAF50] h-2.5 rounded-full"
                style={{
                  width: `${
                    totalCount > 0 ? (processedCount / totalCount) * 100 : 0
                  }%`,
                }}
              />
            </div>
            <p className="mt-2 text-white">
              {isProcessing
                ? `처리 중: ${processedCount}/${totalCount} (${
                    currentIndex + 1
                  }번째 밈 처리 중)`
                : `완료: ${processedCount}/${totalCount}`}
            </p>
          </div>

          {errors.length > 0 && (
            <div className="mt-4">
              <h3 className="text-md font-medium text-[#ff4d4f]">
                오류 ({errors.length}개)
              </h3>
              <ul className="list-disc pl-5 mt-2 text-[#ff4d4f] space-y-1">
                {errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-between mt-4">
            {!isProcessing && (
              <>
                <button
                  onClick={onCancel}
                  className="py-2 px-4 bg-[#555] text-white border-none rounded cursor-pointer flex items-center gap-2"
                  type="button"
                >
                  <X size={16} /> 닫기
                </button>
                <button
                  onClick={handleReset}
                  className="py-2 px-4 bg-[#2196f3] text-white border-none rounded cursor-pointer flex items-center gap-2"
                  type="button"
                >
                  <Save size={16} /> 새 업로드 시작
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
