'use client';

import MemeModal from '@/app/[locale]/components/ui/Modal';
import MemeEditForm from '@/app/[locale]/memes/components/MemeEditForm';
import { displayedMemesAtom } from '@/app/[locale]/memes/store/memeStore';
import { useRouter } from '@/i18n/navigation';
import { useAtomValue } from 'jotai';
import { use } from 'react';

export default function MemeModalPage({
  params,
}: {
  params: Promise<{ memeId: string }>;
}) {
  const { memeId } = use(params);
  const router = useRouter();

  // Jotai 상태 관리
  const displayedMemes = useAtomValue(displayedMemesAtom);
  const selectedMeme = displayedMemes.find((meme) => meme.id === memeId);

  const onOpenChange = (open: boolean) => {
    if (!open) router.back();
  };

  const handleFormSuccess = () => {
    router.back();
  };

  return (
    <MemeModal isOpen={true} onOpenChange={onOpenChange} title="밈 수정">
      {selectedMeme ? (
        <div className="flex flex-col gap-6">
          <MemeEditForm
            meme={selectedMeme}
            onSuccess={handleFormSuccess}
            onCancel={() => router.back()}
          />
        </div>
      ) : (
        <div className="text-white">
          <p>밈을 찾을 수 없습니다. ID: {memeId}</p>
        </div>
      )}
    </MemeModal>
  );
}
