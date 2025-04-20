-- 이모지 반응 토글 함수
create or replace function toggle_emoji_reaction(
  p_post_id text,
  p_emoji text
) returns boolean as $$
declare
  v_auth_id uuid;
  v_profile_id uuid;
  v_existing_id uuid;
begin
  -- 현재 인증된 사용자 ID 가져오기
  v_auth_id := auth.uid();
  
  -- 인증되지 않은 경우 오류
  if v_auth_id is null then
    raise exception '인증되지 않은 사용자입니다';
  end if;
  
  -- profiles 테이블에서 해당 사용자의 id 찾기
  select id into v_profile_id from profiles where id = v_auth_id;
  
  if v_profile_id is null then
    raise exception '프로필을 찾을 수 없습니다';
  end if;

  -- 기존 반응 확인
  select id into v_existing_id from emoji_reactions
  where post_id = p_post_id and user_id = v_profile_id and emoji = p_emoji;
  
  -- 토글 처리: 있으면 삭제, 없으면 추가
  if v_existing_id is not null then
    delete from emoji_reactions where id = v_existing_id;
  else
    insert into emoji_reactions(post_id, user_id, emoji)
    values (p_post_id, v_profile_id, p_emoji);
  end if;
  
  return true;
exception
  when others then
    raise;
end;
$$ language plpgsql security definer;

-- 게시물별 이모지 개수 조회 함수
create or replace function get_emoji_counts(p_post_id text)
returns table (
  emoji text,
  count bigint
) as $$
begin
  return query
    select er.emoji, count(*)::bigint
    from emoji_reactions er
    where er.post_id = p_post_id
    group by er.emoji
    order by count(*) desc, er.emoji;
end;
$$ language plpgsql; 