'use client';
import TagCheckbox from '@/components/meme/TagCheckbox';
import Button from '@/components/ui/Button';
import Form from '@/components/ui/Form';
import { ImageUploader } from '@/components/ui/Form';
import { useTags } from '@/swr/meme';
import * as Dialog from '@radix-ui/react-dialog';
import { Plus, X } from 'lucide-react';

interface AddMemeModalProps {
  onClose: () => void;
}

const AddMemeModal = ({ onClose }: AddMemeModalProps) => {
  const { data: tags, isValidating: isTagsValidating } = useTags();

  // 태그 데이터 로딩 중이면 아무것도 보여주지 않음
  if (isTagsValidating) return null;

  const handleSubmit = async (formData: FormData) => {
    const imageFile = formData.get('image') as File;

    if (!imageFile || imageFile.size === 0) {
      alert('이미지를 첨부해주세요');
      return;
    }

    const title = formData.get('title') as string;

    const tagArr = formData.getAll('tagArr') as string[];
    const tagStr = formData.get('tagStr') as string;
    const tagIds = [...tagArr, ...tagStr.split(',')].filter(Boolean);

    // TODO: 실제 이미지 업로드 및 밈 추가 액션 구현 필요
    console.log({ title, tagIds, imageFile });
    onClose();
  };

  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-stone-800 w-full max-w-3xl overflow-hidden z-50 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-4">
            <Dialog.Title className="text-xl font-semibold text-white">
              새 밈 추가
            </Dialog.Title>
            <Dialog.Close asChild>
              <Button bg="transparent" Icon={X} aria-label="닫기" />
            </Dialog.Close>
          </div>

          <form className="space-y-6 p-4" action={handleSubmit}>
            <ImageUploader name="image" required />
            <Form.Text title="제목" name="title" />
            <Form.Text title="태그" name="tagStr" placeholder="쉼표로 구분" />
            <TagCheckbox tags={tags ?? []} name="tagArr" initialValues={[]} />

            <Button type="submit" bg="green" Icon={Plus} className="ml-auto">
              추가
            </Button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AddMemeModal;
