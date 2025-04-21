'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { Trash } from 'lucide-react';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('Comment');
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
      setError(t('deleteError'));
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
            className="text-[#5E5E5E] hover:text-gray-400 disabled:opacity-50 cursor-pointer"
            aria-label={t('deleteComment')}
            type="button"
            disabled={isDeleting}
          >
            <Trash size={20} />
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/80" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black p-6 shadow-lg w-[90vw] max-w-md border border-[#5E5E5E]">
            <Dialog.Title className="text-lg font-medium mb-4 dark:text-white">
              {t('deleteComment')}
            </Dialog.Title>
            <Dialog.Description className="text-gray-600 dark:text-gray-300 mb-6">
              {t('deleteConfirm')}
            </Dialog.Description>

            <div className="flex justify-end gap-3">
              <Dialog.Close asChild>
                <button
                  className="px-4 py-2 text-sm text-white cursor-pointer"
                  type="button"
                >
                  {t('cancel')}
                </button>
              </Dialog.Close>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm bg-white text-black border border-[#5E5E5E] hover:bg-black hover:text-white disabled:opacity-50 cursor-pointer"
                type="button"
              >
                {isDeleting ? t('deleting') : t('delete')}
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
