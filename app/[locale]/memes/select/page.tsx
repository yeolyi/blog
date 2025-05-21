'use client';

import Button from '@/components/ui/Button';
import { uploadMemesToDB } from '@/db/meme/create';
import { useRouter } from '@/i18n/navigation';
import { useCrawlStore } from '@/store/crawl';
import { Check } from 'lucide-react';
import { useActionState } from 'react';

export default function SelectPage() {
  const router = useRouter();
  const imageUrls = useCrawlStore((state) => state.urlList);

  const getProxiedImageUrl = (originalUrl: string) => {
    return `/api/image-proxy?url=${encodeURIComponent(originalUrl)}`;
  };

  const onSubmit = async (prevState: undefined, formData: FormData) => {
    const selectedImages = formData.getAll('selectedImages') as string[];

    try {
      const memes = selectedImages.map((url) => ({
        title: 'imported',
        imageURL: url,
      }));
      await uploadMemesToDB(memes);
      router.push('/memes');
    } catch (error) {
      console.error('밈 업로드 오류:', error);
      window.alert('업로드 중 오류가 발생했습니다');
    }

    // TODO: 이거 없으면 void라서 useActionState에서 오류남...
    return undefined;
  };

  const [state, formAction, isPending] = useActionState(onSubmit, undefined);

  return (
    <form
      action={formAction}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-20"
    >
      {imageUrls.map((url) => (
        <div key={url} className="relative">
          <input
            type="checkbox"
            id={`img-${url}`}
            name="selectedImages"
            value={url}
            className="sr-only peer"
          />
          <label
            htmlFor={`img-${url}`}
            className="block cursor-pointer peer-checked:opacity-50"
          >
            <img
              src={getProxiedImageUrl(url)}
              alt="밈 이미지"
              className="w-full h-auto"
              loading="lazy"
            />
          </label>
        </div>
      ))}

      <Button
        bg="green"
        type="submit"
        Icon={Check}
        disabled={isPending}
        className="fixed bottom-10 left-1/2 -translate-x-1/2"
      >
        {isPending ? '추가 중...' : '선택한 이미지 추가'}
      </Button>
    </form>
  );
}
