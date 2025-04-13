'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

// 댓글 목록 불러오기 액션
export async function getComments(postId: string) {
  try {
    const supabase = await createClient();

    // 모든 개발자 목록을 가져와서 인덱스 생성
    const { data: allProfiles } = await supabase
      .from('profiles')
      .select('id')
      .order('created_at', { ascending: true });

    // 개발자 ID를 인덱스로 매핑 (0부터 시작하는 번호 부여)
    const developerIndices = new Map();
    allProfiles?.forEach((profile, index) => {
      developerIndices.set(profile.id, index);
    });

    // 댓글 목록 가져오기
    const { data: comments, error } = await supabase
      .from('comments')
      .select(`
        *,
        profiles (
          id,
          github_id
        )
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('댓글 불러오기 에러:', error);
      throw new Error('댓글을 불러오는 중 오류가 발생했습니다.');
    }

    // 각 댓글에 개발자 번호 추가
    const commentsWithDevNumbers = comments.map((comment) => {
      const profileId = comment.profiles?.id;
      const developerNumber = profileId
        ? developerIndices.get(profileId)
        : null;

      return {
        ...comment,
        developerNumber: developerNumber !== undefined ? developerNumber : -1,
      };
    });

    return { comments: commentsWithDevNumbers };
  } catch (error) {
    console.error('댓글 목록 불러오기 에러:', error);
    throw new Error('댓글을 불러오는 중 오류가 발생했습니다.');
  }
}

// 댓글 작성 서버 액션
export async function createComment(formData: FormData) {
  const postId = formData.get('postId') as string;
  const content = formData.get('content') as string;

  if (!postId || !content?.trim()) {
    return { error: '필요한 정보가 누락되었습니다.' };
  }

  try {
    const supabase = await createClient();

    // 현재 사용자 확인
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: '인증되지 않은 사용자입니다.' };
    }

    // 댓글 작성
    const { error } = await supabase.from('comments').insert({
      post_id: postId,
      content,
      author_id: user.id,
    });

    if (error) throw error;

    // 페이지 다시 불러오기
    revalidatePath(`/post/${postId}`);

    return { success: true };
  } catch (error) {
    console.error('댓글 작성 에러:', error);
    return { error: '댓글 작성 중 오류가 발생했습니다.' };
  }
}

// 댓글 삭제 서버 액션
export async function deleteComment(formData: FormData) {
  const commentId = formData.get('commentId') as string;
  const postId = formData.get('postId') as string;

  if (!commentId || !postId) {
    return { error: '필요한 정보가 누락되었습니다.' };
  }

  try {
    const supabase = await createClient();

    // 현재 사용자 확인
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: '인증되지 않은 사용자입니다.' };
    }

    // 삭제 전 댓글 작성자 확인
    const { data: comment } = await supabase
      .from('comments')
      .select('author_id')
      .eq('id', commentId)
      .single();

    if (!comment || comment.author_id !== user.id) {
      return { error: '댓글을 삭제할 권한이 없습니다.' };
    }

    // 댓글 삭제
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) throw error;

    // 페이지 다시 불러오기
    revalidatePath(`/post/${postId}`);

    return { success: true };
  } catch (error) {
    console.error('댓글 삭제 에러:', error);
    return { error: '댓글 삭제 중 오류가 발생했습니다.' };
  }
}

// 댓글 수정 서버 액션
export async function updateComment(formData: FormData) {
  const commentId = formData.get('commentId') as string;
  const postId = formData.get('postId') as string;
  const content = formData.get('content') as string;

  if (!commentId || !postId || !content?.trim()) {
    return { error: '필요한 정보가 누락되었습니다.' };
  }

  try {
    const supabase = await createClient();

    await supabase
      .from('comments')
      .update({ content, updated_at: new Date().toISOString() })
      .eq('id', commentId)
      .throwOnError();

    revalidatePath(`/post/${postId}`);

    return { success: true };
  } catch (error) {
    console.error('댓글 수정 에러:', error);
    return { error: '댓글 수정 중 오류가 발생했습니다.' };
  }
}

/**
 * 이모지 반응을 추가하는 서버 액션
 */
export async function toggleEmojiReaction({
  postId,
  emoji,
}: {
  postId: string;
  emoji: string;
}) {
  try {
    const supabase = await createClient();

    await supabase
      .rpc('toggle_emoji_reaction', {
        p_post_id: postId,
        p_emoji: emoji,
      })
      .throwOnError();

    revalidatePath(`/post/${postId}`);
    return { success: true };
  } catch (error) {
    console.error('이모지 반응 추가 오류:', error);
    return { error: '서버 오류가 발생했습니다.' };
  }
}

/**
 * 게시물의 이모지 반응 개수를 가져오는 서버 액션
 */
export async function getEmojiReactions(postId: string) {
  const supabase = await createClient();

  const { data } = (await supabase
    .rpc('get_emoji_counts', {
      p_post_id: postId,
    })
    .throwOnError()) as {
    data: {
      emoji: string;
      count: number;
      user_reacted: boolean;
    }[];
  };

  return data;
}
