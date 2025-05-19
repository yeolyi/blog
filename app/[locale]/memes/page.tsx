'use client';

import { TagContainer, TagItem } from '@/app/[locale]/components/ui/Form';
import { isDev } from '@/constants/phase';
import { getMemesByTag, getRecentMemes } from '@/db/meme/read';
import { getTags } from '@/db/memeTag/read';
import { Link } from '@/i18n/navigation';
import type { Meme } from '@/types/helper.types';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { Masonry } from 'masonic';
import useSWR from 'swr';

export const maxDuration = 60;

// 선택된 태그를 localStorage에 저장하는 atom 생성
const selectedTagAtom = atomWithStorage<string | null>(
  'selected-meme-tag',
  null,
);

export default function MemeViewer() {
  const { data: allTags } = useSWR('/api/tags', getTags);
  const [selectedTag, setSelectedTag] = useAtom(selectedTagAtom);

  // 선택된 태그가 있으면 해당 태그의 밈을, 없으면 최근 밈을 가져옴
  const { data: tagMemes } = useSWR(
    selectedTag ? selectedTag : null,
    selectedTag ? getMemesByTag : null,
  );

  // 선택된 태그가 없을 때 최근 밈을 가져옴
  const { data: recentMemes } = useSWR(
    selectedTag ? null : '/api/memes/recent',
    selectedTag ? null : getRecentMemes,
  );

  // 표시할 밈 데이터
  const memes = selectedTag ? tagMemes : recentMemes;

  return (
    <div className="flex flex-col gap-8 mt-20 px-4 max-w-2xl mx-auto">
      <TagContainer>
        {allTags?.map((tag) => (
          <TagItem
            key={tag.id}
            tag={tag}
            onClickTag={() =>
              setSelectedTag((currentTag) => {
                if (currentTag === tag.id) return null;
                return tag.id;
              })
            }
            isSelected={selectedTag === tag.id}
          />
        ))}
      </TagContainer>

      {memes && (
        <Masonry
          key={selectedTag ?? '$recent$'}
          items={memes}
          itemKey={(item) => item.id}
          columnGutter={16}
          columnWidth={300}
          render={MemeCard}
        />
      )}
    </div>
  );
}

const MemeCard = ({ data: meme }: { data: Meme }) => {
  return (
    <Link
      locale="ko"
      href={`/memes/random/${meme.id}`}
      className="flex flex-col bg-stone-800"
    >
      <img
        src={
          isDev
            ? `https://placehold.co/${meme.width}x${meme.height}`
            : meme.media_url
        }
        alt={meme.title ?? ''}
        width={meme.width}
        height={meme.height}
      />
      <p className="text-white p-1">{meme.title}</p>
    </Link>
  );
};
