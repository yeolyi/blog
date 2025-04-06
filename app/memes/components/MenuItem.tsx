"use client";

import { getMediaTypeFromUrl } from "@/utils/form";
import Image from "next/image";
import Link from "next/link";
import { Meme } from "@/types/meme";
import { styled } from "@pigment-css/react";

interface MemeItemProps {
  meme: Meme;
  ref: ((ref: HTMLDivElement) => void) | null;
}

export function MemeItem({ meme, ref }: MemeItemProps) {

  return (
    <MemeCard key={meme.id} ref={ref}>
      <MemeLink href={`/memes/${meme.id}`}>
        {getMediaTypeFromUrl(meme.media_url) === "image" ? (
          <Image
            src={meme.media_url}
            alt={meme.title}
            width={300}
            height={200}
            style={{ objectFit: "cover" }}
          />
        ) : (
          <MediaContainer>
            <video
              src={meme.media_url}
              controls
              style={{ width: "100%", height: "200px" }}
            >
              Your browser does not support video playback.
            </video>
          </MediaContainer>
        )}

        <ContentContainer>
          <MemeTitle>{meme.title}</MemeTitle>
          {meme.description && (
            <MemeDescription>{meme.description}</MemeDescription>
          )}

          <TagContainer>
            {meme.meme_tags.map((tag) => (
              <Tag key={tag.tag_id}>{tag.tags.name}</Tag>
            ))}
          </TagContainer>
        </ContentContainer>
      </MemeLink>
    </MemeCard>
  );
}

const MemeCard = styled.div`
  border: 1px solid #5e5e5e;
  &:hover {
    transform: translateY(-4px);
  }
  width: 300px;
`;

const MemeLink = styled(Link)`
  text-decoration: none;
`;

const MediaContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const ContentContainer = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const MemeTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
`;

const MemeDescription = styled.p`
  color: #e0e0e0;
  font-size: 0.9rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Tag = styled.span`
  background-color: white;
  color: black;
  font-size: 1rem;
  font-weight: 500;
`;