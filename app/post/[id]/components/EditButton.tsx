'use client';

import { Edit } from 'lucide-react';

interface EditButtonProps {
  commentId: string;
  onClick?: () => void;
}

export function EditButton({ commentId, onClick }: EditButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 mr-2"
      aria-label="댓글 수정"
    >
      <Edit size={16} />
    </button>
  );
}
