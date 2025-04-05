"use client";

import { Meme } from "@/types/meme";
import { getMediaTypeFromUrl } from "@/utils/form";
import Image from "next/image";
import Link from "next/link";

interface MemeDetailProps {
  meme: Meme;
  isAdmin: boolean;
}

export default function MemeDetail({ meme, isAdmin }: MemeDetailProps) {
  return (
    <div>
      <div style={{ marginBottom: "1rem" }}>
        <Link href="/memes" style={{ textDecoration: "none" }}>
          ← 목록으로 돌아가기
        </Link>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          {getMediaTypeFromUrl(meme.media_url) === "image" ? (
            <Image
              src={meme.media_url}
              alt={meme.title}
              width={800}
              height={600}
              style={{
                maxWidth: "100%",
                height: "auto",
                objectFit: "contain",
              }}
            />
          ) : (
            <video
              src={meme.media_url}
              controls
              style={{ maxWidth: "100%", height: "auto" }}
            >
              Your browser does not support video playback.
            </video>
          )}
        </div>

        <div style={{ padding: "1rem" }}>
          <h1 style={{ marginBottom: "0.5rem" }}>{meme.title}</h1>

          {meme.description && (
            <p style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>
              {meme.description}
            </p>
          )}

          <div style={{ marginTop: "1rem" }}>
            <h3>태그</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {meme.meme_tags.length > 0 ? (
                meme.meme_tags.map((tag) => (
                  <span
                    key={tag.tag_id}
                    style={{
                      background: "#f0f0f0",
                      padding: "0.5rem 1rem",
                      borderRadius: "20px",
                      fontSize: "0.9rem",
                    }}
                  >
                    {tag.tags.name}
                  </span>
                ))
              ) : (
                <span>태그 없음</span>
              )}
            </div>
          </div>

          {isAdmin && (
            <div style={{ marginTop: "2rem" }}>
              <Link
                href={`/memes/${meme.id}/edit`}
                style={{
                  background: "#4CAF50",
                  color: "white",
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  textDecoration: "none",
                  marginRight: "1rem",
                }}
              >
                수정하기
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
