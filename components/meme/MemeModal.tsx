'use client';
import TagCheckbox from '@/components/meme/TagCheckbox';
import Button from '@/components/ui/Button';
import Form from '@/components/ui/Form';
import { deleteMeme, updateMeme, useMemeTagIds, useTags } from '@/swr/meme';
import type { Meme } from '@/types/helper.types';
import * as Dialog from '@radix-ui/react-dialog';
import { Save, Trash, X } from 'lucide-react';

interface MemeModalProps {
  meme: Pick<Meme, 'id' | 'media_url' | 'title' | 'height' | 'width'>;
  onClose: () => void;
}

const MemeModal = ({ meme, onClose }: MemeModalProps) => {
  const { data: tags, isValidating: isTagsValidating } = useTags();
  const { data: selectedTagIds, isValidating: isTagIdsValidating } =
    useMemeTagIds(meme.id);

  // form에 defaultValue 잘못 들어가면 안됨
  if (isTagsValidating || isTagIdsValidating) return null;

  const handleSubmit = async (formData: FormData) => {
    const title = formData.get('title') as string;

    const tagArr = formData.getAll('tagArr') as string[];
    const tagStr = formData.get('tagStr') as string;
    const tags = [...tagArr, ...tagStr.split(',')].filter(Boolean);

    await updateMeme({ id: meme.id, title, tags });
    onClose();
  };

  const handleDelete = async () => {
    const confirmed = confirm('정말 삭제하시겠습니까?');
    if (confirmed) {
      await deleteMeme(meme.id);
      onClose();
    }
  };

  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-stone-800 w-full max-w-3xl overflow-hidden z-50 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-4">
            <Dialog.Title className="text-xl font-semibold text-white">
              밈 편집
            </Dialog.Title>
            <Dialog.Close asChild>
              <Button bg="transparent" Icon={X} aria-label="닫기" />
            </Dialog.Close>
          </div>

          <form className="space-y-6 p-4" action={handleSubmit}>
            <Form.Text
              title="제목"
              name="title"
              defaultValue={meme.title ?? ''}
            />
            <Form.Text title="태그" name="tagStr" />
            <TagCheckbox
              tags={tags ?? []}
              name="tagArr"
              initialValues={selectedTagIds ?? []}
            />

            <div className="flex justify-between gap-2">
              <Button
                type="button"
                bg="red"
                Icon={Trash}
                onClick={handleDelete}
              >
                삭제
              </Button>
              <Button type="submit" bg="green" Icon={Save}>
                저장
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default MemeModal;
