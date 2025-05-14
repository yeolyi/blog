'use client';

import { uploadMultipleMemes } from '@/app/[locale]/memes/actions';
import { type FormEvent, useState } from 'react';

interface BulkMemeUploadFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function BulkMemeUploadForm({
  onSuccess,
  onCancel,
}: BulkMemeUploadFormProps) {
  const [jsonText, setJsonText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // JSON 문자열 파싱
      const memes = JSON.parse(jsonText);

      if (!Array.isArray(memes)) {
        throw new Error('JSON은 배열 형태여야 합니다.');
      }

      // 데이터 유효성 검사
      for (const meme of memes) {
        if (!meme.title || !meme.imageURL) {
          throw new Error('모든 항목은 title과 imageURL을 포함해야 합니다.');
        }
      }

      // 서버 액션 호출
      const result = await uploadMultipleMemes(memes);

      if (result.success) {
        // 성공시 바로 모달 닫기
        onSuccess();
      } else {
        setError(result.message || '업로드 실패');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '유효하지 않은 JSON 형식';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="bg-[#ffebee] text-[#c62828] p-4 rounded mb-4">
          <strong>오류:</strong> {error}
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="jsonInput" className="block mb-2 font-bold text-white">
          JSON 데이터 (title, imageURL 포함 객체 배열)
        </label>
        <textarea
          id="jsonInput"
          value={jsonText}
          onChange={(e) => setJsonText(e.target.value)}
          rows={10}
          className="w-full p-2 rounded bg-[#333] text-white border border-[#555]"
          placeholder='[{"title": "밈 제목", "imageURL": "https://example.com/image.jpg", "tags": "태그1,태그2"}]'
          required
        />
        <p className="text-xs text-[#aaa] mt-1">
          예시: [&#123;"title": "밈 제목", "imageURL":
          "https://example.com/image.jpg", "tags": "태그1,태그2"&#125;]
        </p>
      </div>

      <div className="flex justify-between mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="py-2 px-4 bg-[#555] text-white border-none rounded cursor-pointer flex items-center gap-2"
          disabled={isLoading}
        >
          취소
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="py-2 px-4 bg-[#2196f3] text-white border-none rounded cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 hover:bg-[#42a5f5]"
        >
          {isLoading ? '업로드 중...' : '일괄 업로드'}
        </button>
      </div>
    </form>
  );
}
