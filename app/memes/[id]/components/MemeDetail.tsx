"use client";

import { Meme } from "@/types/meme";
import { getMediaTypeFromUrl } from "@/utils/form";
import Image from "next/image";
import Link from "next/link";
import { styled } from "@pigment-css/react";
import { useState } from "react";
import { deleteMeme } from "@/app/memes/actions";
import { useRouter } from "next/navigation";

interface MemeDetailProps {
  meme: Meme;
  isAdmin: boolean;
}

export default function MemeDetail({ meme, isAdmin }: MemeDetailProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm("정말로 이 밈을 삭제하시겠습니까?")) {
      setIsDeleting(true);
      try {
        await deleteMeme(meme.id);
        router.push("/memes");
      } catch (error) {
        console.error("삭제 중 오류:", error);
        alert("삭제 중 오류가 발생했습니다.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <Container>
      <MediaWrapper>
        {getMediaTypeFromUrl(meme.media_url) === "image" ? (
          <Image
            src={meme.media_url}
            alt={meme.title}
            fill
            style={{
              objectFit: "contain",
            }}
          />
        ) : (
          <VideoElement src={meme.media_url} controls>
            Your browser does not support video playback.
          </VideoElement>
        )}
      </MediaWrapper>

      <InfoContainer>
        <MemeTitle>{meme.title}</MemeTitle>

        {meme.description && (
          <MemeDescription>{meme.description}</MemeDescription>
        )}

        <TagsContainer>
          {meme.meme_tags.length > 0 ? (
            meme.meme_tags.map((tag) => (
              <TagItem key={tag.tag_id}>{tag.tags.name}</TagItem>
            ))
          ) : (
            <NoTagsText>태그 없음</NoTagsText>
          )}
        </TagsContainer>

        {isAdmin && (
          <AdminActions>
            <EditLink href={`/memes/${meme.id}/edit`}>수정하기</EditLink>
            <DeleteButton 
              onClick={handleDelete} 
              disabled={isDeleting}
            >
              {isDeleting ? "삭제 중..." : "삭제하기"}
            </DeleteButton>
          </AdminActions>
        )}
      </InfoContainer>

      <BackLink href="/memes">← 목록으로 돌아가기</BackLink>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  max-width: 600px;
  margin: 0 auto;
  margin-top: 5rem;
  margin-bottom: 10rem;
  padding: 1rem;
`;

const MediaWrapper = styled.div`
  position: relative;
  max-width: 800px;
  width: 100%;
  aspect-ratio: 1/1;
  margin: 0 auto;
  text-align: center;
`;

const VideoElement = styled.video`
  max-width: 100%;
  height: auto;
`;

const InfoContainer = styled.div`
  padding: 1rem;
  background-color: rgba(30, 30, 30, 0.3);
  border: 1px solid #5e5e5e;
`;

const MemeTitle = styled.h1`
  margin-bottom: 0.5rem;
  font-size: 1.8rem;
  font-weight: 600;
  color: white;
`;

const MemeDescription = styled.p`
  margin-bottom: 1rem;
  font-size: 1.1rem;
  line-height: 1.5;
  color: #e0e0e0;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
`;

const TagItem = styled.span`
  background: white;
  color: black;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
`;

const NoTagsText = styled.span`
  color: #aaaaaa;
  font-style: italic;
`;

const AdminActions = styled.div`
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
`;

const EditLink = styled(Link)`
  background: #4caf50;
  color: white;
  padding: 0.5rem 1rem;
  text-decoration: none;

  &:hover {
    background: #66bb6a;
  }
`;

const BackLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    color: #e0e0e0;
    text-decoration: underline;
  }
`;

const DeleteButton = styled.button`
  background: #ff4d4f;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background: #ff7875;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
