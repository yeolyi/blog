"use client";

import { getMediaTypeFromUrl } from "@/utils/form";
import Image from "next/image";
import { deleteMeme } from "@/app/memes/actions";
import { useState } from "react";
import Link from "next/link";
import { Meme } from "@/types/meme";

interface MemeItemProps {
  meme: Meme;
  isAdmin: boolean;
}

export function MemeItem({ meme, isAdmin }: MemeItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm("정말로 이 밈을 삭제하시겠습니까?")) {
      setIsDeleting(true);
      try {
        await deleteMeme(meme.id);
      } catch (error) {
        console.error("삭제 중 오류:", error);
        alert("삭제 중 오류가 발생했습니다.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div key={meme.id} style={{ border: "1px solid #e0e0e0", padding: "1rem" }}>
      <Link
        href={`/memes/${meme.id}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        {getMediaTypeFromUrl(meme.media_url) === "image" ? (
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
      </Link>

      {isAdmin && (
        <div style={{ marginTop: "10px" }}>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            style={{
              padding: "5px 10px",
              backgroundColor: "#ff4d4f",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: isDeleting ? "not-allowed" : "pointer",
            }}
          >
            {isDeleting ? "삭제 중..." : "삭제"}
          </button>

          <Link href={`/memes/${meme.id}/edit`}>
            <button
              style={{
                marginLeft: "10px",
                padding: "5px 10px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              수정
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
