"use server";

import { createClient } from "@/utils/supabase/server";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";
import { connectMemeToTag } from "@/app/actions/meme";
import { uploadFileToSupabase } from "@/app/actions/supabase";

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

        // URL에서 파일 다운로드
        const mediaResponse = await fetch(meme.media_url);
        if (!mediaResponse.ok) {
          throw new Error(
            `밈 #${i + 1}: 미디어 다운로드 실패 (${mediaResponse.status})`
          );
        }

        // 파일 데이터 가져오기
        const blob = await mediaResponse.blob();
        const fileExt = meme.media_url.split(".").pop()?.split("?")[0] || "";
        const fileName = `${uuidv4()}.${fileExt}`;

        // Supabase 스토리지에 업로드
        const publicUrl = await uploadFileToSupabase(fileName, blob);

        // memes 테이블에 정보 저장
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

        // 태그 처리 (선택사항)
        if (meme.tags && Array.isArray(meme.tags) && meme.tags.length > 0) {
          for (const tagName of meme.tags) {
            try {
              await connectMemeToTag(memeData.id, tagName);
            } catch (tagError) {
              errors.push(
                `밈 #${i + 1}: 태그 처리 오류 (${tagName}): ${
                  (tagError as Error).message
                }`
              );
            }
          }
        }
      } catch (error) {
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
