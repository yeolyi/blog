import { toAVIFAction } from '@/actions/image';
import supabase from '@/db';
import { uploadFileToDB } from '@/db/storage';
import { getErrMessage } from '@/utils/string';
import { v4 } from 'uuid';

export async function uploadMemeToDB({
  title,
  file,
}: {
  title: string;
  file: File;
}) {
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

  // 타입 정의
  type MemeResult = {
    title: string;
    imageURL: string;
    success: boolean;
    meme?: {
      id: string;
      title: string;
      media_url: string;
    };
    error?: string;
  };

  // Promise.all로 모든 밈 업로드 시도 (모든 Promise는 fulfilled 됨)
  const results = await Promise.all(
    memes.map(async (meme, index) => {
      console.log(`항목 ${index + 1}/${memes.length} 처리 중: ${meme.title}`);
      try {
        const response = await toAVIFAction(meme.imageURL);
        if (typeof response === 'string') {
          throw new Error(`이미지를 가져올 수 없음: ${response}`);
        }

        const blob = new Blob([response], { type: 'image/avif' });

        // Blob으로 변환
        console.log(`이미지 다운로드 완료: ${blob.size} 바이트`);

        // 파일 이름 추출
        const urlParts = meme.imageURL.split('/');
        const fileName = urlParts[urlParts.length - 1];

        // File 객체 생성
        const file = new File([blob], fileName, { type: blob.type });

        // 단일 밈 업로드 함수 호출
        console.log(`Supabase에 업로드 중: ${meme.title}`);
        const result = await uploadMemeToDB({
          title: meme.title,
          file,
        });

        // uploadSingleMeme의 반환값에서 success 확인
        if (result.type === 'success') {
          console.log(`항목 업로드 성공: ${meme.title}`);
          return {
            title: meme.title,
            imageURL: meme.imageURL,
            success: true,
            meme: result.meme,
          } as MemeResult;
        }

        console.error(`업로드 실패 (${meme.title}): ${result.error}`);

        return {
          title: '인스타',
          imageURL: meme.imageURL,
          success: false,
          error: result.error,
        } as MemeResult;
      } catch (error) {
        // 이미지 다운로드 등 외부 오류
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.error(
          `[일괄 업로드] 예외 발생 (${meme.title}): ${errorMessage}`,
        );
        return {
          title: meme.title,
          imageURL: meme.imageURL,
          success: false,
          error: errorMessage,
        } as MemeResult;
      }
    }),
  );

  // 성공/실패 항목 분류
  const succeeded = results.filter((result) => result.success);
  const failed = results.filter((result) => !result.success);

  const successCount = succeeded.length;
  const failCount = failed.length;

  // 최종 로그 출력
  console.log(
    `[일괄 업로드] 완료: 총 ${memes.length}개 중 ${successCount}개 성공, ${failCount}개 실패`,
  );

  // 실패한 항목 상세 로그
  if (failed.length > 0) {
    console.log('[일괄 업로드] 실패 항목 목록:');
    failed.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.title}: ${item.error}`);
    });
  }

  console.log(
    JSON.stringify(
      failed.map((item) => ({
        title: item.title,
        imageURL: item.imageURL,
      })),
    ),
    null,
    2,
  );

  return { success: failed.length === 0 };
}
