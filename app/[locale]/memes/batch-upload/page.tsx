'use client';

import BatchUploader from '@/app/[locale]/memes/batch-upload/components/BatchUploader';

export default function BatchUploadPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">밈 일괄 업로드</h1>
      <p className="mb-6">
        JSON 형식으로 밈 배열을 제출하면 URL의 이미지/비디오를 다운로드하여
        업로드합니다.
      </p>

      <BatchUploader />
    </div>
  );
}
