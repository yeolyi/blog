'use server';

import { createClient } from '@/utils/supabase/server';

export const uploadFileToSupabase = async (filePath: string, file: Blob) => {
  const supabase = await createClient();

  // 스토리지에 파일 업로드
  const { error: uploadError } = await supabase.storage
    .from('memes')
    .upload(filePath, file);

  if (uploadError) throw new Error(`파일 업로드 실패: ${uploadError.message}`);

  // 업로드된 파일의 공개 URL 가져오기
  const {
    data: { publicUrl },
  } = supabase.storage.from('memes').getPublicUrl(filePath);

  return publicUrl;
};
