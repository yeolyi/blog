"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getMemes(tag?: string) {
  const supabase = await createClient();

  let query = supabase.from("memes").select(
    `
      *,
      meme_tags(
        tag_id,
        tags(id, name)
      )
    `
  );

  // 태그가 제공된 경우, 해당 태그를 가진 밈만 필터링
  if (tag) {
    // 먼저 태그 ID를 가져옵니다
    const { data: tagData } = await supabase
      .from("tags")
      .select("id")
      .eq("name", tag)
      .single();

    if (tagData?.id) {
      // 해당 태그 ID를 가진 밈 ID 목록을 가져옵니다
      const { data: memeIds } = await supabase
        .from("meme_tags")
        .select("meme_id")
        .eq("tag_id", tagData.id);

      if (memeIds && memeIds.length > 0) {
        // 해당 밈 ID만 필터링합니다
        query = query.in(
          "id",
          memeIds.map((item) => item.meme_id)
        );
      } else {
        // 일치하는 밈이 없으면 빈 결과 반환
        return [];
      }
    } else {
      // 일치하는 태그가 없으면 빈 결과 반환
      return [];
    }
  }

  // 정렬 적용
  query = query.order("created_at", { ascending: true });

  const { data, error } = await query;

  if (error) {
    console.error("밈 불러오기 오류:", error);
    throw new Error("밈을 불러오는 중 오류가 발생했습니다");
  }

  return data;
}

export async function deleteMeme(id: string) {
  const supabase = await createClient();

  // 1. 밈 정보 가져오기 (스토리지 파일 경로를 위해)
  const { data: meme } = await supabase
    .from("memes")
    .select("media_url")
    .eq("id", id)
    .single()
    .throwOnError();

  // 2. 밈 레코드 삭제 (meme_tags는 CASCADE로 자동 삭제됨)
  await supabase.from("memes").delete().eq("id", id).throwOnError();

  // 3. 스토리지에서 파일 삭제 (URL에서 경로 추출)
  try {
    // URL에서 파일 경로 추출 (memes 버킷 가정)
    const fileUrl = new URL(meme.media_url);
    const filePath = fileUrl.pathname.split(
      "/storage/v1/object/public/memes/"
    )[1]; // 'memes' 버킷 경로 추출

    if (filePath) {
      const { error: storageError } = await supabase.storage
        .from("memes")
        .remove([filePath]);

      if (storageError) {
        console.error("스토리지 파일 삭제 오류:", storageError);
        // 파일 삭제 실패는 치명적이지 않으므로 그냥 로그만 남김
      }
    }
  } catch (err) {
    console.error("스토리지 파일 경로 처리 오류:", err);
    // URL 처리 오류는 치명적이지 않으므로 무시
  }

  // 페이지 재검증
  revalidatePath("/private/memes");

  return { success: true };
}

export async function getAllTags() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tags")
    .select("id, name")
    .order("name");

  if (error) {
    console.error("태그 불러오기 오류:", error);
    throw new Error("태그를 불러오는 중 오류가 발생했습니다");
  }

  return data;
}
