'use server';

import { connectMemeToTag } from '@/actions/meme';
import { uploadFileToSupabase } from '@/actions/supabase';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import probe from 'probe-image-size';
import { v4 as uuidv4 } from 'uuid';

export async function getMemes() {
  const supabase = await createClient();

  const query = supabase
    .from('memes')
    .select(
      `
      *,
      meme_tags(
        tag_id,
        tags(id, name)
      )
    `,
    )
    .limit(10000); // 기본값이 1000임

  // 항상 모든 데이터 가져오기 (페이지네이션은 프론트엔드에서 처리)
  const { data, error } = await query;

  if (error) {
    console.error('밈 불러오기 오류:', error);
    throw new Error('밈을 불러오는 중 오류가 발생했습니다');
  }

  return data;
}

export async function deleteMeme(id: string) {
  const supabase = await createClient();

  // 1. 밈과 연결된 태그 ID들을 먼저 가져오기
  const { data: memeTags } = await supabase
    .from('meme_tags')
    .select('tag_id')
    .eq('meme_id', id);

  const tagIds = memeTags?.map((tag) => tag.tag_id) || [];

  // 2. 밈 정보 가져오기 (스토리지 파일 경로를 위해)
  const { data: meme } = await supabase
    .from('memes')
    .select('media_url')
    .eq('id', id)
    .single()
    .throwOnError();

  // 3. 밈 레코드 삭제 (meme_tags는 CASCADE로 자동 삭제됨)
  await supabase.from('memes').delete().eq('id', id).throwOnError();

  // 4. 각 태그에 대해 다른 밈이 연결되어 있는지 확인하고, 없으면 태그 삭제
  for (const tagId of tagIds) {
    const { count } = await supabase
      .from('meme_tags')
      .select('*', { count: 'exact', head: true })
      .eq('tag_id', tagId);

    // 연결된 밈이 없으면 태그 삭제
    if (count === 0) {
      await supabase.from('tags').delete().eq('id', tagId);
    }
  }

  // 5. 스토리지에서 파일 삭제 (URL에서 경로 추출)
  try {
    // URL에서 파일 경로 추출 (memes 버킷 가정)
    const fileUrl = new URL(meme.media_url);
    const filePath = fileUrl.pathname.split(
      '/storage/v1/object/public/memes/',
    )[1]; // 'memes' 버킷 경로 추출

    if (filePath) {
      const { error: storageError } = await supabase.storage
        .from('memes')
        .remove([filePath]);

      if (storageError) {
        console.error('스토리지 파일 삭제 오류:', storageError);
        // 파일 삭제 실패는 치명적이지 않으므로 그냥 로그만 남김
      }
    }
  } catch (err) {
    console.error('스토리지 파일 경로 처리 오류:', err);
    // URL 처리 오류는 치명적이지 않으므로 무시
  }

  // 페이지 재검증
  revalidatePath('/private/memes');

  return { success: true };
}

export async function getAllTags() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('tags')
    .select('id, name')
    .order('name');

  if (error) {
    console.error('태그 불러오기 오류:', error);
    throw new Error('태그를 불러오는 중 오류가 발생했습니다');
  }

  return data;
}

/**
 * ID로 밈 데이터와 태그 정보를 조회하는 함수
 */
export async function getMemeById(id: string) {
  const supabase = await createClient();

  const { data: meme } = await supabase
    .from('memes')
    .select(
      `
      *,
      meme_tags(
        tag_id,
        tags(id, name)
      )
    `,
    )
    .eq('id', id)
    .single()
    .throwOnError();

  return meme;
}

export async function updateMeme({
  id,
  title,
  tags,
  hidden,
}: {
  id: string;
  title: string;
  tags?: string[];
  hidden?: boolean;
}) {
  const supabase = await createClient();

  // 0. 업데이트 전에 밈과 연결된 태그 ID 목록을 가져옵니다
  const { data: memeTags } = await supabase
    .from('meme_tags')
    .select('tag_id')
    .eq('meme_id', id);

  const oldTagIds = memeTags?.map((tag) => tag.tag_id) || [];

  // 1. 밈 정보 업데이트
  await supabase
    .from('memes')
    .update({ title, hidden: hidden !== undefined ? hidden : false })
    .eq('id', id)
    .throwOnError();

  // 2. 기존 태그 관계 삭제 (태그 자체는 삭제하지 않음)
  await supabase.from('meme_tags').delete().eq('meme_id', id).throwOnError();

  // 3. 각 태그에 대해 다른 밈이 연결되어 있는지 확인하고, 없으면 태그 삭제
  for (const tagId of oldTagIds) {
    const { count } = await supabase
      .from('meme_tags')
      .select('*', { count: 'exact', head: true })
      .eq('tag_id', tagId);

    // 연결된 밈이 없으면 태그 삭제
    if (count === 0) {
      await supabase.from('tags').delete().eq('id', tagId);
    }
  }

  // 4. 새 태그 연결
  if (tags && tags.length > 0) {
    for (const tagName of tags) {
      if (tagName.trim()) {
        try {
          // 외부 함수를 사용해 태그 연결
          await connectMemeToTag(id, tagName.trim());
        } catch (error) {
          console.error(`태그 연결 오류 (${tagName}):`, error);
        }
      }
    }
  }

  // 5. 업데이트된 밈 데이터를 가져옴
  const updatedMeme = await getMemeById(id);

  return { success: true, meme: updatedMeme };
}

/**
 * 단일 밈 업로드를 처리하는 서버 액션
 */
export async function uploadSingleMeme({
  title,
  file,
  tags,
}: {
  title: string;
  file: File;
  tags?: string;
}) {
  try {
    const supabase = await createClient();

    // 파일 업로드
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const url = await uploadFileToSupabase(fileName, file);

    // TODO: 업로드하고 다시 다운로드받아서 보는게 맞나...?
    const { width, height } = await probe(url);

    // memes 테이블에 정보 저장
    const memeData = {
      title,
      media_url: url,
      width,
      height,
    };

    const { data: meme } = await supabase
      .from('memes')
      .insert([memeData])
      .select()
      .single()
      .throwOnError();

    // 태그 처리
    if (tags) {
      const tagNames = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag);

      if (tagNames.length > 0) {
        for (const tagName of tagNames) {
          await connectMemeToTag(meme.id, tagName);
        }
      }
    }

    return { success: true, meme };
  } catch (error) {
    console.error('밈 업로드 오류:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * 여러 밈을 한 번에 업로드하는 서버 액션
 */
export async function uploadMultipleMemes(
  memes: { title: string; imageURL: string; tags?: string }[],
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
      console.log(
        `[일괄 업로드] 항목 ${index + 1}/${memes.length} 처리 중: ${meme.title}`,
      );
      try {
        // 외부 URL에서 이미지 파일 가져오기
        console.log(`[일괄 업로드] 이미지 다운로드 중: ${meme.imageURL}`);
        const response = await fetch(meme.imageURL);
        if (!response.ok) {
          throw new Error(`이미지를 가져올 수 없음: ${meme.imageURL}`);
        }

        // Blob으로 변환
        const blob = await response.blob();
        console.log(`[일괄 업로드] 이미지 다운로드 완료: ${blob.size} 바이트`);

        // 파일 이름 추출
        const urlParts = meme.imageURL.split('/');
        const fileName = urlParts[urlParts.length - 1];

        // File 객체 생성
        const file = new File([blob], fileName, { type: blob.type });

        // 단일 밈 업로드 함수 호출
        console.log(`[일괄 업로드] Supabase에 업로드 중: ${meme.title}`);
        const result = await uploadSingleMeme({
          title: meme.title,
          file,
          tags: meme.tags,
        });

        // uploadSingleMeme의 반환값에서 success 확인
        if (result.success) {
          console.log(`[일괄 업로드] 항목 업로드 성공: ${meme.title}`);
          return {
            title: meme.title,
            imageURL: meme.imageURL,
            success: true,
            meme: result.meme,
          } as MemeResult;
        }

        // 업로드 실패한 경우 (uploadSingleMeme에서 {success: false, error: ...} 반환)
        console.error(
          `[일괄 업로드] 업로드 실패 (${meme.title}): ${result.error}`,
        );
        return {
          title: meme.title,
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

  return {
    success: successCount > 0,
    succeeded,
    failed,
    message: `${successCount}/${memes.length} 밈이 성공적으로 업로드됨`,
  };
}
