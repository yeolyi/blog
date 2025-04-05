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

// 단일 밈 업로드 함수
export async function uploadSingleMeme(meme: Meme) {
  try {
    // 필수 필드 검사
    if (!meme.title || !meme.media_url) {
      throw new Error("제목과 미디어 URL은 필수입니다");
    }

    const supabase = await createClient();

    // URL에서 파일 다운로드
    const mediaResponse = await fetch(meme.media_url);
    if (!mediaResponse.ok) {
      throw new Error(`미디어 다운로드 실패 (${mediaResponse.status})`);
    }

    // 파일 데이터 가져오기
    const blob = await mediaResponse.blob();
    const fileExt = meme.media_url.split(".").pop()?.split("?")[0] || "";
    const fileName = `${uuidv4()}.${fileExt}`;

    // Supabase 스토리지에 업로드
    const publicUrl = await uploadFileToSupabase(fileName, blob);

    // memes 테이블에 정보 저장
    const { data: memeData } = await supabase
      .from("memes")
      .insert([
        {
          title: meme.title,
          description: meme.description || null,
          media_url: publicUrl,
        },
      ])
      .select()
      .single()
      .throwOnError();

    // 태그 처리 (선택사항)
    const tagErrors: string[] = [];
    if (meme.tags && Array.isArray(meme.tags) && meme.tags.length > 0) {
      for (const tagName of meme.tags) {
        try {
          await connectMemeToTag(memeData.id, tagName);
        } catch (tagError) {
          tagErrors.push(
            `태그 처리 오류 (${tagName}): ${(tagError as Error).message}`
          );
        }
      }
    }

    // 페이지 재검증
    revalidatePath("/memes");

    return {
      success: true,
      memeId: memeData.id,
      tagErrors: tagErrors.length > 0 ? tagErrors : null,
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message,
    };
  }
}
