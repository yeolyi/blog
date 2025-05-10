'use client';

import type { Meme } from '@/types/meme';
import { Edit, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { deleteMeme } from '../actions';
import TagList from './TagList';

interface MemeDetailProps {
  meme: Meme;
  isAdmin: boolean;
  onEdit: () => void;
  onDeleteSuccess: () => void;
}

export default function MemeDetail({
  meme,
  isAdmin,
  onEdit,
  onDeleteSuccess,
}: MemeDetailProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm('정말로 이 밈을 삭제하시겠습니까?')) {
      setIsDeleting(true);
      try {
        await deleteMeme(meme.id);
        router.refresh();
        onDeleteSuccess();
      } catch (error) {
        console.error('삭제 중 오류:', error);
        alert('삭제 중 오류가 발생했습니다.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-semibold text-white">{meme.title}</h1>

      <p className="text-lg leading-relaxed text-[#e0e0e0]">
        {meme.description}
      </p>

      <TagList tags={meme.meme_tags} />

      {isAdmin && (
        <div className="mt-8 flex gap-4">
          <button
            type="button"
            onClick={onEdit}
            className="bg-[#4caf50] text-white py-2 px-4 border-none font-medium cursor-pointer hover:bg-[#66bb6a] flex items-center gap-2"
          >
            <Edit size={16} /> 수정하기
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-[#ff4d4f] text-white py-2 px-4 border-none font-medium cursor-pointer hover:bg-[#ff7875] disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            type="button"
          >
            {isDeleting ? (
              '삭제 중...'
            ) : (
              <>
                <Trash2 size={16} /> 삭제하기
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
