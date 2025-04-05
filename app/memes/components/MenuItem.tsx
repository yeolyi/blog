import { Meme } from "@/app/memes/components/MemeList";
import Image from "next/image";

interface MemeItemProps {
  meme: Meme;
}

export function MemeItem({ meme }: MemeItemProps) {
  return (
    <div key={meme.id}>
      {meme.media_type === "image" ? (
        <div>
          <Image
            src={meme.media_url}
            alt={meme.title}
            width={300}
            height={200}
            style={{
              width: "100%",
              height: "200px",
              objectFit: "cover",
            }}
          />
        </div>
      ) : (
        <div>
          <video
            src={meme.media_url}
            controls
            style={{ width: "100%", height: "200px" }}
          >
            Your browser does not support video playback.
          </video>
        </div>
      )}

      <div>
        <h3>{meme.title}</h3>
        {meme.description && <p>{meme.description}</p>}
        <div>
          {meme.meme_tags.map((tag) => (
            <span key={tag.tag_id}>{tag.tags.name}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
