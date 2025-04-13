'use client';

import { Trash } from 'lucide-react';
import { useState } from 'react';

interface DeleteButtonProps {
  commentId: string;
  postId: string;
  deleteAction: (
    formData: FormData,
  ) => Promise<{ success?: boolean; error?: string }>;
}

export function DeleteButton({
  commentId,
  postId,
  deleteAction,
}: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setIsDeleting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('commentId', commentId);
      formData.append('postId', postId);

      const result = await deleteAction(formData);

      if (result.error) {
        setError(result.error);
      }
    } catch (e) {
      setError('댓글 삭제 중 오류가 발생했습니다.');
      console.error('댓글 삭제 에러:', e);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="text-gray-500 hover:text-gray-800 disabled:opacity-50 dark:text-gray-400 dark:hover:text-gray-200"
        aria-label="댓글 삭제"
        type="button"
      >
        <Trash size={16} />
      </button>
      {error && (
        <div className="mt-2 text-xs text-gray-700 dark:text-gray-300">
          {error}
        </div>
      )}
    </>
  );
}
