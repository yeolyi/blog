'use client';

import { getIsAdmin } from '@/utils/auth';
import { PlusCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import MemeModal, { ModalTrigger } from './MemeModal';
import MemeUploadForm from './MemeUploadForm';

export default function Admin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

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
    </div>
  );
}
