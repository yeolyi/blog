"use client";

import { usePathname } from "next/navigation";
import { MemeItem } from "./MenuItem";
import Link from "next/link";

export interface Tag {
  id: string;
  name: string;
}

export interface MemeTag {
  tag_id: string;
  tags: Tag;
}

export interface Meme {
  id: string;
  title: string;
  description: string | null;
  media_url: string;
  created_at: string;
  meme_tags: MemeTag[];
}

interface MemeListProps {
  memes: Meme[];
  isAdmin: boolean;
  allTags: Tag[];
  selectedTag?: string;
}

export default function MemeList({
  memes,
  isAdmin,
  allTags,
  selectedTag,
}: MemeListProps) {
  const pathname = usePathname();

  return (
    <div>
      <div>
        <div>
          <span>태그 필터링:</span>
          <Link href={pathname}>
            <button className={selectedTag ? "" : "selected"}>전체</button>
          </Link>
          {allTags.map((tag) => (
            <Link
              key={tag.id}
              href={`${pathname}?tag=${encodeURIComponent(tag.name)}`}
            >
              <button className={selectedTag === tag.name ? "selected" : ""}>
                {tag.name}
              </button>
            </Link>
          ))}
        </div>
      </div>

      {memes.length === 0 ? (
        <div>
          <p>표시할 밈이 없습니다</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1rem",
          }}
        >
          {memes.map((meme) => (
            <MemeItem key={meme.id} meme={meme} isAdmin={isAdmin} />
          ))}
        </div>
      )}
    </div>
  );
}
