'use client';

import { useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { uploadMemes } from '../actions';

export const maxDuration = 60;

interface FormInputs {
  memesJson: string;
}

interface Meme {
  title: string;
  description?: string;
  media_url: string;
  tags?: string[];
}

const textareaPlaceholder = `[
  {
    "title": "재밌는 밈",
    "description": "설명 (선택사항)",
    "media_url": "https://example.com/image.jpg",
    "tags": ["웃긴", "귀여운"]
  }
]`;
export default function BatchUploader() {
  const [errors, setErrors] = useState<string[]>([]);
  const [processedCount, setProcessedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

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
    <div className="bg-white p-6 rounded-lg shadow-md">
      {!isProcessing && !isSubmitSuccessful ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="memesJson"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              밈 JSON 배열
            </label>
            <textarea
              id="memesJson"
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={textareaPlaceholder}
              {...register('memesJson', {
                required: 'JSON 데이터를 입력하세요',
              })}
            />
            {formErrors.memesJson && (
              <p className="mt-1 text-sm text-red-600">
                {formErrors.memesJson.message?.toString() || ''}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isSubmitting ? '업로드 중...' : '업로드 시작'}
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            {!isProcessing ? '업로드 완료' : '업로드 진행 중...'}
          </h2>

          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-indigo-600 h-2.5 rounded-full"
                style={{
                  width: `${
                    totalCount > 0 ? (processedCount / totalCount) * 100 : 0
                  }%`,
                }}
              />
            </div>
            <p className="mt-2">
              {isProcessing
                ? `처리 중: ${processedCount}/${totalCount} (${
                    currentIndex + 1
                  }번째 밈 처리 중)`
                : `완료: ${processedCount}/${totalCount}`}
            </p>
          </div>

          {errors.length > 0 && (
            <div className="mt-4">
              <h3 className="text-md font-medium text-red-600">
                오류 ({errors.length}개)
              </h3>
              <ul className="list-disc pl-5 mt-2 text-sm text-red-600 space-y-1">
                {errors.map((error, index) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {!isProcessing && (
            <button
              onClick={handleReset}
              className="mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              type="button"
            >
              새 업로드 시작
            </button>
          )}
        </div>
      )}
    </div>
  );
}
