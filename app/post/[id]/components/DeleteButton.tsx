'use client';

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
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path
            d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H3.5C3.22386 4 3 3.77614 3 3.5ZM3.5 5C3.22386 5 3 5.22386 3 5.5C3 5.77614 3.22386 6 3.5 6H4V12C4 12.5523 4.44772 13 5 13H10C10.5523 13 11 12.5523 11 12V6H11.5C11.7761 6 12 5.77614 12 5.5C12 5.22386 11.7761 5 11.5 5H3.5ZM5 6H10V12H5V6Z"
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {error && (
        <div className="mt-2 text-xs text-gray-700 dark:text-gray-300">
          {error}
        </div>
      )}
    </>
  );
}
