import { Meme } from "@/types/meme";
import { getMediaTypeFromUrl } from "@/utils/form";
import { css } from "@pigment-css/react";
import Image from "next/image";

export default function MemeTileMedia({ meme }: { meme: Meme }) {
  return getMediaTypeFromUrl(meme.media_url) === "image" ? (
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
  );
}

const imageStyle = css({
  objectFit: "cover",
});

const videoStyle = css({
  width: "100%",
  height: "100%",
  objectFit: "cover",
});
