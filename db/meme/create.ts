import supabase from '@/db';
import { uploadFileToDB } from '@/db/storage';
import { getErrMessage } from '@/utils/string';
import { v4 } from 'uuid';

export async function uploadMemeToDB(title: string, file: Blob) {
  try {
    const fileExt = file.type.split('/')[1];
    const fileName = `${v4()}.${fileExt}`;
    const url = await uploadFileToDB(fileName, file);

    // 이미지 크기 얻기
    const { width, height } = await new Promise<{
      width: number;
      height: number;
    }>((resolve) => {
      const img = new Image();
      img.onload = () => {
        const { naturalWidth, naturalHeight } = img;
        resolve({ width: naturalWidth, height: naturalHeight });
      };
      img.src = url;
    });

    const { data: meme } = await supabase
      .from('memes')
      .insert([{ title, media_url: url, width, height }])
      .select()
      .single()
      .throwOnError();

    return { type: 'success' as const, meme };
  } catch (error) {
    return {
      type: 'upload_failed' as const,
      error: getErrMessage(error),
    };
  }
}
