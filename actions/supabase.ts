'use server';
import { uploadFile } from '@/db/storage';
import { v4 as uuidv4 } from 'uuid';

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
    return await uploadFile(fileName, blob);
  } catch (error) {
    console.error('이미지 다운로드 및 업로드 중 오류:', error);
    throw new Error(
      `이미지 다운로드 실패: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
