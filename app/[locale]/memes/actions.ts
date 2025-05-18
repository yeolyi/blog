'use server';

import { connectMemeToTag } from '@/actions/meme';
import { uploadFileToSupabase } from '@/actions/supabase';
import type { Meme } from '@/types/meme';
import { getInstagramImageList } from '@/utils/puppeteer';
import { getErrMessage } from '@/utils/string';
import { createClient } from '@/utils/supabase/server';
import {
  type ImageFeatureExtractionPipeline,
  pipeline,
} from '@xenova/transformers';
import probe from 'probe-image-size';
import { v4 as uuidv4 } from 'uuid';

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
}: {
  id: string;
  title: string;
  tags?: string[];
}) {
  const supabase = await createClient();

  // 0. 업데이트 전에 밈과 연결된 태그 ID 목록을 가져옵니다
  const { data: memeTags } = await supabase
    .from('meme_tags')
    .select('tag_id')
    .eq('meme_id', id);

  const oldTagIds = memeTags?.map((tag) => tag.tag_id) || [];

  // 1. 밈 정보 업데이트
  await supabase.from('memes').update({ title }).eq('id', id).throwOnError();

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

// match_similar_meme RPC 함수의 반환 타입 정의
interface SimilarMemeMatch {
  id: string;
  title: string;
  media_url: string;
  distance: number;
}

/**
 * 단일 밈 업로드를 처리하는 서버 액션
 */
export async function uploadSingleMeme({
  title,
  file,
}: {
  title: string;
  file: File;
}) {
  const supabase = await createClient();

  // 파일 업로드 전에 임시 URL 생성해서 유사도 검사
  const tempUrl = URL.createObjectURL(file);

  try {
    // 임베딩 벡터 생성
    const embedding = await getClipEmbeddingFromUrl(tempUrl);

    // 유사한 밈 검색 (threshold 0.1 이하는 매우 유사한 이미지로 간주)
    const { data: matches, error } = await supabase.rpc('match_similar_meme', {
      query_embedding: embedding,
      match_threshold: 0.1,
      match_count: 5,
    });

    // 유사한 이미지가 발견된 경우
    if (matches && matches.length > 0) {
      console.log(`유사한 밈 발견: ${matches.length}개`);

      // URL 객체 해제
      URL.revokeObjectURL(tempUrl);

      // 가장 유사한 이미지 정보 반환
      return {
        type: 'similar_meme_found' as const,
        similarMemes: (matches as SimilarMemeMatch[]).map((m) => m.id),
        error: '이미 유사한 밈이 등록되어 있습니다.',
      };
    }

    const fileExt = file.type.split('/')[1];
    const fileName = `${uuidv4()}.${fileExt}`;
    const url = await uploadFileToSupabase(fileName, file);

    // 이미지 크기 얻기
    const { width, height } = await probe(url);

    const { data: meme } = await supabase
      .from('memes')
      .insert([
        {
          title,
          media_url: url,
          width,
          height,
          embedding,
        },
      ])
      .select()
      .single()
      .throwOnError();

    return { type: 'success' as const, meme };
  } catch (error) {
    return {
      type: 'upload_failed' as const,
      error: getErrMessage(error),
    };
  } finally {
    // URL 객체 해제
    URL.revokeObjectURL(tempUrl);
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
        });

        // uploadSingleMeme의 반환값에서 success 확인
        if (result.type === 'success') {
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

export async function updateMissingEmbeddings() {
  const supabase = await createClient();

  // 1. 임베딩이 없는 밈만 가져오기
  const { data: memes } = await supabase
    .from('memes')
    .select('id, media_url')
    .is('embedding', null)
    .throwOnError();

  const results: { id: string; status: string }[] = [];

  for (const meme of memes) {
    try {
      const embedding = await getClipEmbeddingFromUrl(meme.media_url);

      await supabase
        .from('memes')
        .update({ embedding: embedding })
        .eq('id', meme.id)
        .throwOnError();

      console.log(`[일괄 업로드] 업데이트 완료: ${meme.id}`);
    } catch (err) {
      console.error(err);
    }
  }

  return results;
}

let extractor: ImageFeatureExtractionPipeline | null = null;

export async function getClipEmbeddingFromUrl(
  imageUrl: string,
): Promise<number[]> {
  if (!extractor) {
    extractor = await pipeline(
      'image-feature-extraction',
      'Xenova/clip-vit-large-patch14',
      { cache_dir: '/tmp/.cache' },
    );
  }

  const output = await extractor(imageUrl);
  const outputArr = Array.from(output.data);
  const norm = Math.sqrt(outputArr.reduce((sum, x) => sum + x * x, 0));
  return outputArr.map((x) => x / norm);
}

export async function checkAllSimilarMemes() {
  const supabase = await createClient();

  // 1. 모든 임베딩 가져오기
  const { data: memes, error } = await supabase
    .from('memes')
    .select('id, media_url, embedding')
    .not('embedding', 'is', null);

  if (error) throw new Error(`❌ 임베딩 불러오기 실패: ${error.message}`);

  const seenPairs = new Set<string>(); // 중복 쌍 방지용

  for (const meme of memes) {
    const { id, embedding } = meme;

    // 2. 자기 자신 제외하고 유사한 밈 찾기
    const { data: matches, error: matchError } = await supabase.rpc(
      'match_similar_meme',
      {
        query_embedding: embedding,
        match_threshold: 0.1,
        match_count: 5, // 여러 개 찾되 자기 자신은 제거
      },
    );

    if (matchError) {
      console.error(`❌ ${id} 비교 중 오류:`, matchError);
      continue;
    }

    for (const match of matches) {
      if (match.id === id) continue; // 자기 자신 제외

      // 중복 비교 방지 (a-b, b-a 모두 피함)
      const key = [id, match.id].sort().join('-');
      if (seenPairs.has(key)) continue;
      seenPairs.add(key);

      console.log(`🔁 유사한 밈 발견:
  - ${id} (${meme.media_url})
  - ${match.id} (${match.media_url})
  - 거리: ${match.distance.toFixed(4)}
`);
    }
  }

  return { done: true };
}

// 랜덤 밈 가져오기
export async function getRandomMeme(): Promise<Meme> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc('get_random_meme');

  if (error) {
    console.error('랜덤 밈 가져오기 오류:', error);
    throw new Error('밈을 가져오는 중 오류가 발생했습니다');
  }

  return data;
}

// 태그 ID로 밈 목록 조회
export async function getMemesByTag(tagId: string): Promise<Meme[]> {
  const supabase = await createClient();

  // 태그 ID에 해당하는 밈 조회
  const { data, error } = await supabase
    .from('meme_tags')
    .select(
      `
      meme_id,
      memes(*)
    `,
    )
    .eq('tag_id', tagId);

  if (error) {
    console.error('태그별 밈 조회 오류:', error);
    throw new Error('밈을 불러오는 중 오류가 발생했습니다');
  }

  // 결과 데이터 형식 변환
  const memes = data
    .filter((item) => item.memes) // null 체크
    .map((item) => item.memes);

  // @ts-expect-error 고쳐야됨
  return memes;
}

export async function crawlInstagramImage(url: string) {
  try {
    const imageUrl = await getInstagramImageList(url);
    console.log(imageUrl);
    // 밈 업로드
    // const response = await fetch(imageUrl);
    // const blob = await response.blob();

    // const urlParts = imageUrl.split('/');
    // const fileName = urlParts[urlParts.length - 1];
    // const file = new File([blob], fileName, { type: blob.type });

    // return await uploadSingleMeme({ file, title: url });
  } catch (error) {
    console.error('인스타그램 크롤링 오류:', error);
    return {
      type: 'upload_failed' as const,
      error: getErrMessage(error),
    };
  }
}
