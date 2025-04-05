"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { batchUploadMemes } from "../actions";

export const maxDuration = 60;

interface FormInputs {
  memesJson: string;
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

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      setErrors([]);

      const result = await batchUploadMemes(data.memesJson);

      if (result.success) {
        setProcessedCount(result.processed);
        if (result.errors) {
          setErrors(result.errors);
        }
      } else {
        setErrors([result.error || "알 수 없는 오류가 발생했습니다."]);
      }
    } catch (error) {
      setErrors([(error as Error).message]);
    }
  };

  const handleReset = () => {
    reset();
    setErrors([]);
    setProcessedCount(0);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {!isSubmitting && !isSubmitSuccessful ? (
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
              {...register("memesJson", {
                required: "JSON 데이터를 입력하세요",
              })}
            />
            {formErrors.memesJson && (
              <p className="mt-1 text-sm text-red-600">
                {formErrors.memesJson.message?.toString() || ""}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isSubmitting ? "업로드 중..." : "업로드 시작"}
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            {isSubmitSuccessful ? "업로드 완료" : "업로드 진행 중..."}
          </h2>

          {isSubmitSuccessful && (
            <p>총 {processedCount}개의 밈이 업로드되었습니다.</p>
          )}

          {errors.length > 0 && (
            <div className="mt-4">
              <h3 className="text-md font-medium text-red-600">
                오류 ({errors.length}개)
              </h3>
              <ul className="list-disc pl-5 mt-2 text-sm text-red-600 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {isSubmitSuccessful && (
            <button
              onClick={handleReset}
              className="mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              새 업로드 시작
            </button>
          )}
        </div>
      )}
    </div>
  );
}
