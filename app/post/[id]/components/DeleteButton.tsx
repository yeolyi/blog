'use client';

import * as Dialog from '@radix-ui/react-dialog';
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
  const [open, setOpen] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    setError(null);
    setOpen(false);

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
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <button
            className="text-gray-500 hover:text-gray-800 disabled:opacity-50 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="댓글 삭제"
            type="button"
            disabled={isDeleting}
          >
            <Trash size={16} />
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-6 rounded-md shadow-lg w-[90vw] max-w-md">
            <Dialog.Title className="text-lg font-medium mb-4 dark:text-white">
              댓글 삭제
            </Dialog.Title>
            <Dialog.Description className="text-gray-600 dark:text-gray-300 mb-6">
              정말 이 댓글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </Dialog.Description>

            <div className="flex justify-end gap-3">
              <Dialog.Close asChild>
                <button
                  className="px-4 py-2 text-sm border border-gray-300 rounded-md dark:border-gray-600 dark:text-gray-300"
                  type="button"
                >
                  취소
                </button>
              </Dialog.Close>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
                type="button"
              >
                {isDeleting ? '삭제 중...' : '삭제'}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      {error && (
        <div className="mt-2 text-xs text-gray-700 dark:text-gray-300">
          {error}
        </div>
      )}
    </>
  );
}
