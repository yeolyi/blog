'use client';
import { crawlImageAction } from '@/actions/crawl';
import AddMemeModal from '@/components/meme/AddMemeModal';
import MemeCard, { type MemeCardProps } from '@/components/meme/MemeCard';
import TagRadio from '@/components/meme/TagRadio';
import Button from '@/components/ui/Button';
import Form from '@/components/ui/Form';
import { getRandomMemesFromDB } from '@/db/meme/read';
import { useRouter } from '@/i18n/navigation';
import { useCrawlStore } from '@/store/crawl';
import { NO_TAG_ID, useMemes, useTags } from '@/swr/meme';
import { shuffled } from '@/utils/array';
import { AppWindow, Clipboard, PlusCircle, Shuffle } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useEffect, useReducer, useState } from 'react';

// ResizeObserver 문제 해결을 위해 dynamic import
const Masonry = dynamic(
  () => import('masonic').then((mod) => mod.Masonry<MemeCardProps>),
  { ssr: false },
);

export default function MemeViewer() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { data: _tags } = useTags();
  const tagSearchParam = searchParams.get('tag');
  const selectedTag = tagSearchParam ?? NO_TAG_ID;

  const { data: dbMemes } = useMemes(selectedTag);

  const [memes, setMemes] = useState(dbMemes ?? []);
  const [masonryKey, setMasonryKey] = useReducer((x) => x + 1, 0);
  const [showAddModal, setShowAddModal] = useState(false);

  const setUrlList = useCrawlStore((state) => state.setUrlList);

  useEffect(() => {
    setMemes(dbMemes ?? []);
    setMasonryKey();
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
    const randomMemes = await getRandomMemesFromDB(50);
    setMemes(shuffled(randomMemes ?? []));
  };

  const [shouldOpen, setShouldOpen] = useState('');

  const pasteUrl = async () => {
    const url = await navigator.clipboard.readText();
    if (!url) return;

    const crawlResult = await crawlImageAction(url);

    if (crawlResult.success) {
      setUrlList(crawlResult.value);
      router.push('/memes/select');
    } else {
      window.alert(crawlResult.error);
    }
  };

  return (
    <Form onChange={onChange} className="mt-20 px-4 max-w-2xl mx-auto w-full">
      <TagRadio tags={tags} name="tag" initialValue={selectedTag} />
      <Masonry
        key={masonryKey}
        items={memes}
        itemKey={(item) => item.id}
        columnGutter={16}
        columnWidth={300}
        render={MemeCard}
      />
      <div className="fixed bottom-8 right-8 flex flex-col gap-2">
        <Button
          type="button"
          bg="green"
          Icon={PlusCircle}
          onClick={() => setShowAddModal(true)}
        >
          추가
        </Button>
        {selectedTag === NO_TAG_ID && (
          <Button type="button" bg="gray" Icon={Shuffle} onClick={onShuffle}>
            셔플
          </Button>
        )}
        {shouldOpen && (
          <Button
            type="button"
            bg="gray"
            Icon={AppWindow}
            onClick={() => {
              setShouldOpen('');
              open('', '_blank');
            }}
          >
            새 창 열기
          </Button>
        )}
        <Button type="button" bg="gray" Icon={Clipboard} onClick={pasteUrl}>
          붙여넣기
        </Button>
      </div>

      {showAddModal && <AddMemeModal onClose={() => setShowAddModal(false)} />}
    </Form>
  );
}
