"use server";

import { createClient } from "@/utils/supabase/server";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";

interface Meme {
  title: string;
  description?: string;
  media_url: string;
  tags?: string[];
}

export async function batchUploadMemes(jsonData: string) {
  try {
    // JSON 유효성 검사 및 파싱
    let memes: Meme[];
    try {
      memes = JSON.parse(jsonData);
      if (!Array.isArray(memes)) {
        throw new Error("JSON 데이터가 배열 형식이 아닙니다");
      }
    } catch (error) {
      throw new Error(`JSON 파싱 오류: ${(error as Error).message}`);
    }

    const supabase = await createClient();
    const errors: string[] = [];

    // 각 밈 처리
    for (let i = 0; i < memes.length; i++) {
      const meme = memes[i];

      try {
        // 필수 필드 검사
        if (!meme.title || !meme.media_url) {
          throw new Error(`밈 #${i + 1}: 제목과 미디어 URL은 필수입니다`);
        }

        // 1. URL에서 파일 다운로드
        const mediaResponse = await fetch(meme.media_url);
        if (!mediaResponse.ok) {
          throw new Error(
            `밈 #${i + 1}: 미디어 다운로드 실패 (${mediaResponse.status})`
          );
        }

        // 2. 파일 데이터 가져오기
        const blob = await mediaResponse.blob();

        // 3. 확장자 및 미디어 타입 결정
        const fileExt = meme.media_url.split(".").pop()?.split("?")[0] || "";

        const fileName = `${uuidv4()}.${fileExt}`;

        // 4. Supabase 스토리지에 업로드
        const { error: uploadError } = await supabase.storage
          .from("memes")
          .upload(fileName, blob);

        if (uploadError) {
          throw new Error(
            `밈 #${i + 1}: 파일 업로드 실패 - ${uploadError.message}`
          );
        }

        // 5. 공개 URL 가져오기
        const {
          data: { publicUrl },
        } = supabase.storage.from("memes").getPublicUrl(fileName);

        // 6. memes 테이블에 정보 저장
        const { data: memeData, error: memeError } = await supabase
          .from("memes")
          .insert([
            {
              title: meme.title,
              description: meme.description || null,
              media_url: publicUrl,
            },
          ])
          .select()
          .single();

        if (memeError) {
          throw new Error(
            `밈 #${i + 1}: 데이터 저장 실패 - ${memeError.message}`
          );
        }

        // 7. 태그 처리 (선택사항)
        if (meme.tags && Array.isArray(meme.tags) && meme.tags.length > 0) {
          for (const tagName of meme.tags) {
            try {
              // 기존 태그 찾기
              const { data: existingTag } = await supabase
                .from("tags")
                .select("id, name")
                .eq("name", tagName)
                .single();

              let tagId;

              if (!existingTag) {
                // 태그가 없으면 새로 생성
                const { data: newTag, error: tagError } = await supabase
                  .from("tags")
                  .insert([{ name: tagName }])
                  .select()
                  .single();

                if (tagError) {
                  throw new Error(
                    `태그 생성 실패 (${tagName}): ${tagError.message}`
                  );
                }

                tagId = newTag.id;
              } else {
                tagId = existingTag.id;
              }

              // 밈과 태그 연결
              await supabase.from("meme_tags").insert([
                {
                  meme_id: memeData.id,
                  tag_id: tagId,
                },
              ]);
            } catch (tagError) {
              // 태그 처리 오류는 기록하되 계속 진행
              errors.push(
                `밈 #${i + 1}: 태그 처리 오류 (${tagName}): ${
                  (tagError as Error).message
                }`
              );
            }
          }
        }
      } catch (error) {
        // 개별 밈 처리 중 오류가 발생해도 다른 밈은 계속 처리
        errors.push((error as Error).message);
      }
    }

    // 페이지 재검증
    revalidatePath("/memes");

    return {
      success: true,
      processed: memes.length,
      errors: errors.length > 0 ? errors : null,
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
      processed: 0,
    };
  }
}

// 확장자로 미디어 타입 판단하는 함수
function getMediaTypeFromExtension(ext: string): "image" | "video" {
  const videoExtensions = [
    "mp4",
    "webm",
    "ogg",
    "mov",
    "avi",
    "wmv",
    "flv",
    "mkv",
  ];
  return videoExtensions.includes(ext.toLowerCase()) ? "video" : "image";
}
