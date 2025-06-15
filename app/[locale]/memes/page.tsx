'use client';
import { crawlInstagramAction } from '@/actions/crawl';
import { fileToAVIFAction } from '@/actions/image';
import MemeCard, { type MemeCardProps } from '@/components/meme/MemeCard';
import TagRadio from '@/components/meme/TagRadio';
import Button from '@/components/ui/Button';
import Form from '@/components/ui/Form';
import { uploadMemeToDB } from '@/db/meme/create';
import { getRandomMemesFromDB } from '@/db/meme/read';
import { useRouter } from '@/i18n/navigation';
import { useProfile } from '@/swr/auth';
import { memesByTagKey } from '@/swr/key';
import { NO_TAG_ID, useMemes, useTags } from '@/swr/meme';
import type { Meme } from '@/types/helper.types';
import { shuffled } from '@/utils/array';
import { getErrMessage } from '@/utils/string';
import clsx from 'clsx';
import { Instagram, Plus, Shuffle } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useEffect, useReducer, useState } from 'react';
import { toast } from 'react-toastify';
import { mutate } from 'swr';

// ResizeObserver 문제 해결을 위해 dynamic import
const Masonry = dynamic(
  () => import('masonic').then((mod) => mod.Masonry<MemeCardProps>),
  { ssr: false },
);

export default function MemeViewer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: profile } = useProfile();

  const { data: _tags } = useTags();
  const tagSearchParam = searchParams.get('tag');
  const selectedTag = tagSearchParam ?? NO_TAG_ID;

  const { data: dbMemes } = useMemes(selectedTag);

  const [memes, setMemes] = useState<Meme[]>(dbMemes ?? []);
  const [masonryKey, increaseMasonryKey] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    setMemes(dbMemes ?? []);
    increaseMasonryKey();
  }, [dbMemes]);

  const tags = [{ id: NO_TAG_ID, name: '전체' }, ...(_tags ?? [])];

  const onChange = async (e: React.ChangeEvent<HTMLFormElement>) => {
    // 다른 form에서 오는 경우 (모달 등) 제외
    if (e.target.name !== 'tag') return;

    const tagName = e.target.value;
    const tagId = tags?.find((tag) => tag.name === tagName)?.id;
    if (!tagId) return;
    router.push(`/memes?tag=${tagId}`);
  };

  const onShuffle = async () => {
    const randomMemes = await getRandomMemesFromDB(20);
    // @ts-expect-error TODO
    setMemes(shuffled(randomMemes ?? []));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (profile?.role !== 'admin')
    return (
      <p className="text-white text-center mt-20 grow">
        관리자 권한이 필요해요.
      </p>
    );

  return (
    <div className="mt-20 px-4 mx-auto w-full flex flex-col gap-8">
      <form onChange={onChange}>
        <TagRadio tags={tags} name="tag" initialValue={selectedTag} />
      </form>

      {selectedTag === NO_TAG_ID && (
        <>
          <AddMemeForm />
          <CrawlInstagramSection />
        </>
      )}

      <Masonry
        key={masonryKey}
        items={memes}
        itemKey={(item) => item.id}
        columnGutter={16}
        columnWidth={300}
        render={MemeCard}
      />

      <div className="fixed bottom-8 right-8 flex flex-col gap-2">
        {selectedTag === NO_TAG_ID && (
          <Button type="button" bg="gray" Icon={Shuffle} onClick={onShuffle}>
            셔플
          </Button>
        )}
      </div>
    </div>
  );
}

const AddMemeForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <form
      className={clsx('flex flex-col gap-4')}
      onSubmit={async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const title = formData.get('title') as string;
        const image = formData.get('image') as File;

        const avif = await fileToAVIFAction(image);

        if (typeof avif === 'string') {
          toast.error(`이미지 변환 실패: ${avif}`);
          return;
        }

        try {
          await uploadMemeToDB(
            title,
            // TODO: 타입 해결
            new Blob([avif as BlobPart], { type: 'image/avif' }),
          );
          await mutate(memesByTagKey(NO_TAG_ID));
          form.reset();
        } catch (e) {
          toast.error(getErrMessage(e));
        }
        setIsLoading(false);
      }}
    >
      <Form.Text title="제목" name="title" />
      <Form.Image title="이미지" name="image" />
      <Button
        type="submit"
        bg="green"
        Icon={Plus}
        className="self-end"
        isLoading={isLoading}
      >
        추가
      </Button>
    </form>
  );
};

const CrawlInstagramSection = () => {
  const [instaUrlList, setInstaUrlList] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex gap-2 items-center flex-wrap">
      <Button
        type="button"
        bg="green"
        className="self-start"
        Icon={Instagram}
        onClick={async () => {
          setIsLoading(true);
          const clipboardText = await navigator.clipboard.readText();
          const result = await crawlInstagramAction(clipboardText);
          if (typeof result === 'string') {
            toast.error(result);
            return;
          }

          setInstaUrlList(result);
          setIsLoading(false);
        }}
        isLoading={isLoading}
      />
      {instaUrlList.map((url, idx) => (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white w-10 h-10 flex items-center justify-center hover:underline"
          key={url}
        >
          {idx}
        </a>
      ))}
    </div>
  );
};
