'use server';

import { createClient } from '@/utils/supabase/server';
import { v4 as uuidv4 } from 'uuid';

/**
 * Supabase 스토리지에 파일 업로드
 */
export async function uploadFileToSupabase(
  filePath: string,
  file: File | Blob,
): Promise<string> {
  const supabase = await createClient();

  // 파일 업로드
  const { error: uploadError } = await supabase.storage
    .from('memes')
    .upload(filePath, file);

  if (uploadError) {
    // 파일이 이미 존재하는 경우 덮어쓰기 시도
    if (uploadError.message.includes('already exists')) {
      const { error: replaceError } = await supabase.storage
        .from('memes')
        .update(filePath, file);

      if (replaceError) {
        throw new Error(`파일 업로드 오류: ${replaceError.message}`);
      }
    } else {
      throw new Error(`파일 업로드 오류: ${uploadError.message}`);
    }
  }

  // 업로드된 파일의 공개 URL 가져오기
  const { data: publicUrlData } = supabase.storage
    .from('memes')
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}

/**
 * URL에서 이미지를 다운로드하고 Supabase에 업로드
 */
export async function uploadImageFromUrl(imageUrl: string): Promise<string> {
  try {
    // 이미지 다운로드
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`이미지 다운로드 실패 (${response.status})`);
    }

    // Blob으로 변환
    const blob = await response.blob();

    // 파일 확장자 추출
    const fileExt = imageUrl.split('.').pop()?.split('?')[0] || 'jpg';
    const fileName = `${uuidv4()}.${fileExt}`;

    // Supabase에 업로드
    return await uploadFileToSupabase(fileName, blob);
  } catch (error) {
    console.error('이미지 다운로드 및 업로드 중 오류:', error);
    throw new Error(
      `이미지 다운로드 실패: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
