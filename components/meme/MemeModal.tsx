'use client';
import TagCheckbox from '@/components/meme/TagCheckbox';
import Button from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import Form from '@/components/ui/Form';
import { updateMeme, useMemeTagIds, useTags } from '@/swr/meme';
import type { Meme } from '@/types/helper.types';
import { Save } from 'lucide-react';
import { Dialog, VisuallyHidden } from 'radix-ui';

interface MemeModalProps {
  meme: Pick<
    Meme,
    'id' | 'media_url' | 'title' | 'height' | 'width' | 'hidden'
  >;
  onClose: () => void;
}

const MemeModal = ({ meme, onClose }: MemeModalProps) => {
  const { data: tags, isValidating: isTagsValidating } = useTags();
  const { data: selectedTagIds, isValidating: isTagIdsValidating } =
    useMemeTagIds(meme.id);

  // form에 defaultValue 잘못 들어가면 안됨
  if (isTagsValidating || isTagIdsValidating) return null;

  const handleSubmit = async (formData: FormData) => {
    const tagArr = formData.getAll('tagArr') as string[];
    const tagStr = formData.get('tagStr') as string;
    const tags = [...tagArr, ...tagStr.split(',')].filter(Boolean);

    const hidden = formData.get('hidden') === 'on';

    await updateMeme({ id: meme.id, tags, hidden });
    onClose();
  };

  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-stone-800 w-full max-w-3xl overflow-hidden z-50 max-h-[90vh] overflow-y-auto">
          <VisuallyHidden.Root>
            <Dialog.Title className="text-xl font-semibold text-white">
              밈 편집
            </Dialog.Title>
          </VisuallyHidden.Root>

          <form className="space-y-6 p-4" action={handleSubmit}>
            <Form.Text title="태그" name="tagStr" />
            <TagCheckbox
              tags={tags ?? []}
              name="tagArr"
              initialValues={selectedTagIds ?? []}
            />

            <Form.Label htmlFor="hidden" className="flex items-center gap-2">
              숨김
              <Checkbox name="hidden" defaultChecked={meme.hidden} />
            </Form.Label>

            <div className="flex justify-between gap-2">
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
