'use server';

import { connectMemeToTag } from '@/actions/meme';
import type { Meme } from '@/types/meme';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getMemes(tag?: string, page = 1, pageSize = 30) {
  const supabase = await createClient();

  // 오프셋 계산
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase.from('memes').select(
    `
      *,
      meme_tags(
        tag_id,
        tags(id, name)
      )
    `,
  );

  let tagId = null;

  // 태그가 제공된 경우, 해당 태그를 가진 밈만 필터링
  if (tag) {
    // 먼저 태그 ID를 가져옵니다
    const { data: tagData } = await supabase
      .from('tags')
      .select('id')
      .eq('name', tag)
      .single();

    // 일치하는 태그가 없으면 빈 결과 반환
    if (tagData?.id === undefined) {
      return { data: [], count: 0 };
    }

    tagId = tagData.id;
    // 해당 태그 ID를 가진 밈 ID 목록을 가져옵니다
    const { data: memeIds } = await supabase
      .from('meme_tags')
      .select('meme_id')
      .eq('tag_id', tagId);

    // 일치하는 밈이 없으면 빈 결과 반환
    if (!memeIds || memeIds.length === 0) {
      return { data: [], count: 0 };
    }

    // 해당 밈 ID만 필터링
    query = query.in(
      'id',
      memeIds.map((item) => item.meme_id),
    );
  }

  // 정렬 적용
  query = query.order('created_at', { ascending: true });

  // 카운트 쿼리 생성
  const countQuery =
    tag && tagId
      ? supabase
          .from('meme_tags')
          .select('*', { count: 'exact' })
          .eq('tag_id', tagId)
      : supabase.from('memes').select('*', { count: 'exact', head: true });

  // 페이지네이션 적용
  query = query.range(from, to);

  // 데이터와 총 개수를 병렬로 가져오기
  const [{ data, error }, countResult] = await Promise.all([query, countQuery]);

  if (error || countResult.error) {
    console.error('밈 불러오기 오류:', error || countResult.error);
    throw new Error('밈을 불러오는 중 오류가 발생했습니다');
  }

  return { data: data || [], count: countResult.count || 0 };
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

export async function getMeme(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
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
    .single();

  if (error) {
    console.error('밈 상세 조회 오류:', error);
    throw new Error('밈을 불러오는 중 오류가 발생했습니다');
  }

  return data;
}

export async function updateMeme({
  id,
  title,
  description,
  tags,
}: {
  id: string;
  title: string;
  description?: string;
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
  await supabase
    .from('memes')
    .update({
      title,
      description: description || null,
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

export async function getRandomMeme() {
  const supabase = await createClient();

  // RPC 함수를 사용하여 랜덤 밈 가져오기
  const { data } = await supabase
    .rpc('get_random_meme')
    .single()
    .throwOnError();

  if (!data) {
    return null;
  }

  return data as Meme;
}
