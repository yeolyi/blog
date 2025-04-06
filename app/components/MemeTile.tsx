import Tile from "@/app/components/Tile";
import Link from "next/link";
import { getRandomMeme } from "@/app/memes/actions";
import { css } from "@pigment-css/react";
import MemeTileMedia from "@/app/components/MemeTileMedia";
import { Suspense } from "react";

// 스타일 정의
const linkStyle = css({
  display: "block",
});

const containerStyle = css({
  position: "relative",
  aspectRatio: "5/4",
  overflow: "hidden",
});

export default async function MemeTile() {
  // 랜덤 밈 가져오기
  const meme = await getRandomMeme();
  if (!meme) return;

  return (
    <Tile.Item title="개발 밈 모음집" size="75%">
      <Link href="/memes" className={linkStyle}>
        <div className={containerStyle}>
          <Suspense>
            <MemeTileMedia meme={meme} />
          </Suspense>
        </div>
      </Link>
    </Tile.Item>
  );
}
