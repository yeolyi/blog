import Tile from "@/app/components/Tile";
import Link from "next/link";
import Image from "next/image";
import { getRandomMeme } from "@/app/memes/actions";
import { getMediaTypeFromUrl } from "@/utils/form";
import { css } from "@pigment-css/react";


// 스타일 정의
const linkStyle = css({
  display: "block",
});

const containerStyle = css({
  position: "relative",
  width: "50vw",
  aspectRatio: "16/9",
  overflow: "hidden",
});

const imageStyle = css({
  objectFit: "cover"
});

const videoStyle = css({
  width: "100%",
  height: "100%",
  objectFit: "cover"
});


export default async function MemeTile() {
  // 랜덤 밈 가져오기
  const meme = await getRandomMeme();
  if (!meme) return;
  
  return (
    <Tile.Item title="개발 밈 모음집">
      <Link href="/memes" className={linkStyle}>
          <div className={containerStyle}>
            {getMediaTypeFromUrl(meme.media_url) === "image" ? (
              <Image
                src={meme.media_url}
                alt={meme.title}
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                className={imageStyle}
                priority
              />
            ) : (
              <video
                src={meme.media_url}
                muted
                loop
                autoPlay
                playsInline
                className={videoStyle}
              />
            )}
          </div>
      </Link>
    </Tile.Item>
  );
}
