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

export async function updateMeme({
  id,
  title,
  description,
  tags,
  hidden,
}: {
  id: string;
  title: string;
  description?: string;
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
    .update({
      title,
      description: description || null,
      hidden: hidden !== undefined ? hidden : false,
    })
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

  // 5. 페이지 재검증
  revalidatePath(`/memes/${id}`);
  revalidatePath(`/memes/${id}/edit`);
  revalidatePath('/memes');

  return { success: true };
}

/**
 * 단일 밈 업로드를 처리하는 서버 액션
 */
export async function uploadSingleMeme({
  title,
  description,
  file,
  tags,
}: {
  title: string;
  description?: string;
  file: File;
  tags?: string;
}) {
  try {
    const supabase = await createClient();

    // 파일 업로드
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const url = await uploadFileToSupabase(fileName, file);

    const { width, height } = await probe(url);
    console.log(width, height);
    console.log(tags);

    // memes 테이블에 정보 저장
    const memeData = {
      title,
      description: description || null,
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
