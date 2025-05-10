'use client';

import { getIsAdmin } from '@/utils/auth';
import { PlusCircle, Upload } from 'lucide-react';
import { useEffect, useState } from 'react';
import BatchUploader from './BatchUploader';
import MemeModal, { ModalTrigger } from './MemeModal';
import MemeUploadForm from './MemeUploadForm';

export default function Admin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isBatchUploadOpen, setIsBatchUploadOpen] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const adminStatus = await getIsAdmin();
      setIsAdmin(adminStatus);
    };

    checkAdmin();
  }, []);

  const handleUploadSuccess = () => {
    setIsUploadOpen(false);
  };

  const handleBatchUploadSuccess = () => {
    setIsBatchUploadOpen(false);
  };

  if (!isAdmin) return null;

  return (
    <div className="flex gap-4 mb-4">
      <ModalTrigger
        onClick={() => setIsUploadOpen(true)}
        className="text-white cursor-pointer flex items-center gap-1 bg-[#4caf50] hover:bg-[#66bb6a] py-2 px-4 rounded"
      >
        <PlusCircle size={16} /> 밈 추가
      </ModalTrigger>

      <MemeModal
        isOpen={isUploadOpen}
        onOpenChange={setIsUploadOpen}
        title="새 밈 업로드"
      >
        <MemeUploadForm
          onSuccess={handleUploadSuccess}
          onCancel={() => setIsUploadOpen(false)}
        />
      </MemeModal>

      <ModalTrigger
        onClick={() => setIsBatchUploadOpen(true)}
        className="text-white cursor-pointer flex items-center gap-1 bg-[#2196f3] hover:bg-[#42a5f5] py-2 px-4 rounded"
      >
        <Upload size={16} /> 배치 업로드
      </ModalTrigger>

      <MemeModal
        isOpen={isBatchUploadOpen}
        onOpenChange={setIsBatchUploadOpen}
        title="밈 일괄 업로드"
      >
        <p className="text-white mb-6">
          JSON 형식으로 밈 배열을 제출하면 URL의 이미지/비디오를 다운로드하여
          업로드합니다.
        </p>

        <BatchUploader
          onSuccess={handleBatchUploadSuccess}
          onCancel={() => setIsBatchUploadOpen(false)}
        />
      </MemeModal>
    </div>
  );
}
