'use client';

import { TagContainer, TagItem } from '@/app/[locale]/components/ui/Form';
import { getAllTags, getMemesByTag } from '@/app/[locale]/memes/actions';
import ImportMeme from '@/app/[locale]/memes/components/ImportMeme';
import { Link } from '@/i18n/navigation';
import type { Meme, Tag } from '@/types/meme';
import { Masonry } from 'masonic';
import { useState } from 'react';
import useSWR from 'swr';

export const maxDuration = 60;

export default function MemeViewer() {
  const { data: allTags } = useSWR('/api/tags', getAllTags);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const { data: memes } = useSWR(
    selectedTag ? selectedTag.id : null,
    getMemesByTag,
  );

  return (
    <div className="flex flex-col gap-8 mt-20 px-4 max-w-2xl mx-auto">
      <ImportMeme />

      <TagContainer>
        {(
          allTags ??
          Array.from({ length: 30 }).map((_, i) => ({
            id: i,
            name: '로딩중'[i % 3],
          }))
        ).map((tag) => (
          <TagItem
            key={tag.id}
            tag={tag}
            onClickTag={() => setSelectedTag(tag)}
            isSelected={selectedTag?.id === tag.id}
          />
        ))}
      </TagContainer>

      {memes && (
        <Masonry
          key={selectedTag?.id ?? '$none$'}
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
        src={meme.media_url}
        alt={meme.title}
        width={meme.width}
        height={meme.height}
      />
      <p className="text-white p-1">{meme.title}</p>
    </Link>
  );
};
