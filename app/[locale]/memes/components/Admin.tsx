'use client';

import { PlusCircle, Upload } from 'lucide-react';
import { useState } from 'react';
import BulkMemeUploadForm from './modals/BulkMemeUploadForm';
import MemeModal, { ModalTrigger } from './modals/MemeModal';
import MemeUploadForm from './modals/MemeUploadForm';

interface AdminProps {
  isAdmin: boolean;
}

export default function Admin({ isAdmin }: AdminProps) {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);

  const handleUploadSuccess = () => {
    setIsUploadOpen(false);
  };

  const handleBulkUploadSuccess = () => {
    setIsBulkUploadOpen(false);
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

      <ModalTrigger
        onClick={() => setIsBulkUploadOpen(true)}
        className="text-white cursor-pointer flex items-center gap-1 bg-[#2196f3] hover:bg-[#42a5f5] py-2 px-4 rounded"
      >
        <Upload size={16} /> 일괄 업로드
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

      <MemeModal
        isOpen={isBulkUploadOpen}
        onOpenChange={setIsBulkUploadOpen}
        title="밈 일괄 업로드"
      >
        <BulkMemeUploadForm
          onSuccess={handleBulkUploadSuccess}
          onCancel={() => setIsBulkUploadOpen(false)}
        />
      </MemeModal>
    </div>
  );
}
