import { toAVIFAction } from '@/actions/image';
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

export async function uploadMemesToDB(
  memes: { title: string; imageURL: string }[],
) {
  console.log(`[일괄 업로드] 시작: ${memes.length}개 항목`);

  for (const [index, meme] of memes.entries()) {
    console.log(`항목 ${index + 1}/${memes.length} 처리 중: ${meme.title}`);

    const response = await toAVIFAction(meme.imageURL);
    if (typeof response === 'string') {
      throw new Error(`이미지를 가져올 수 없음: ${response}`);
    }

    // TODO: as가 꼭 필요한가? 서버랑 브라우저 타입 차이 때문인 것 같기도 하고...
    // server action에서 브라우저로 오면서 반환값이 바뀌어서 실제로는 상관없나
    // 근데 왜 editor에서만 뜨고 tsc에서는 아무 문제 없지
    const blob = new Blob([response as BlobPart], { type: 'image/avif' });

    // Blob으로 변환
    console.log(`${index + 1}/${memes.length}: 이미지 변환 완료`);

    // 단일 밈 업로드 함수 호출
    console.log(`Supabase에 업로드 중: ${meme.title}`);
    await uploadMemeToDB(meme.title, blob);
  }
}
