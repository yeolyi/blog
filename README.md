https://supabase.com/docs/guides/auth

- Authentication means checking that a user is who they say they are.
- Authorization means checking what resources a user is allowed to access.

JWT가 갑자기 인기를 끌게 된 이유는 마이크로서비스 아키텍처의 대중화 때문입니다. 여러 개의 독립적인 마이크로서비스(예: API, 웹사이트, 서버 등)가 사용자 인증을 개별적으로 처리해야 하는 상황에서, 전통적인 세션 기반 인증은 비효율적입니다. 세션 토큰 방식은 각 서비스가 세션 정보를 직접 저장하거나 중앙 데이터베이스에 매번 질의해야 하므로 성능 저하가 발생합니다.

반면, JWT는 탈중앙화된 방식입니다. JWT는 자체적으로 서명이 포함되어 있어서, jwt_secret만 알고 있다면 별도의 DB 접근 없이도 토큰의 유효성을 검증할 수 있어 성능 면에서 효율적이고 마이크로서비스 환경에 잘 맞습니다.

Supabase Auth is fully compatible with SSR. You need to make a few changes to the configuration of your Supabase client, **to store the user session in cookies instead of local storage**.

A session is represented by the Supabase Auth access token in the form of a JWT, and a refresh token which is a unique string.

The implicit flow only works on the client. Web browsers do not send the URL fragment to the server by design. This is a security feature. If you wish to obtain the access token and refresh token **on a server**, use the PKCE flow.

Note that cookies is called before any calls to Supabase, which opts fetch calls out of Next.js's caching. This is important for authenticated data fetches, to ensure that users get access only to their own data.

config.toml설정하는데 localhost랑 127.0.0.1 차이가 있다고???

https://github.com/supabase/supabase-js/issues/1381

https://github.com/orgs/supabase/discussions/26791#discussioncomment-10648756

---

# Supabase RLS 정책의 무한 재귀 문제 해결

`infinite recursion detected in policy for relation "profiles"` 오류는 Row Level Security(RLS) 정책이 자기 자신을 참조하여 무한 루프에 빠졌다는 의미입니다.

## 원인

이 문제는 보통 다음과 같은 정책을 설정할 때 발생합니다:

```sql
CREATE POLICY "관리자는 모든 프로필 확인 가능" ON profiles
  FOR SELECT USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );
```

이 정책은 무한 재귀를 유발합니다:

1. 정책이 profiles 테이블 접근을 확인하기 위해
2. profiles 테이블을 다시 쿼리하지만
3. 그 쿼리는 다시 같은 정책을 트리거하고
4. 무한 루프가 발생

## 해결 방법

### 1. 보안 정의자 함수 사용

```sql
-- 1. 사용자 역할을 확인하는 함수 생성
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role FROM profiles WHERE id = auth.uid();
  RETURN user_role = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. 함수를 사용하여 정책 생성
CREATE POLICY "관리자는 모든 프로필 확인 가능" ON profiles
  FOR SELECT USING (
    is_admin() OR auth.uid() = id
  );
```

---


```sql
-- 밈 테이블
CREATE TABLE memes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  media_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 태그 테이블
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 밈-태그 연결 테이블
CREATE TABLE meme_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meme_id UUID REFERENCES memes(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  UNIQUE(meme_id, tag_id)
);

-- profiles 테이블 생성
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 밈 미디어 저장소 버킷 생성
INSERT INTO storage.buckets (id, name, public) VALUES ('memes', 'memes', false);

-- 2. RLS가 활성화되어 있는지 확인
ALTER TABLE public.memes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meme_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. 모든 사용자가 조회 가능하도록 설정
CREATE POLICY "모든 사용자 밈 조회 가능" ON public.memes
  FOR SELECT
  USING (true);

CREATE POLICY "모든 사용자 태그 조회 가능" ON public.tags
  FOR SELECT
  USING (true);

CREATE POLICY "모든 사용자 밈_태그 조회 가능" ON public.meme_tags
  FOR SELECT
  USING (true);

-- 4. admin 사용자만 추가/수정/삭제 가능하도록 설정
-- memes 테이블
CREATE POLICY "관리자만 밈 추가 가능" ON public.memes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "관리자만 밈 수정 가능" ON public.memes
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "관리자만 밈 삭제 가능" ON public.memes
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- tags 테이블
CREATE POLICY "관리자만 태그 추가 가능" ON public.tags
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "관리자만 태그 수정 가능" ON public.tags
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "관리자만 태그 삭제 가능" ON public.tags
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- meme_tags 테이블
CREATE POLICY "관리자만 밈_태그 추가 가능" ON public.meme_tags
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "관리자만 밈_태그 수정 가능" ON public.meme_tags
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "관리자만 밈_태그 삭제 가능" ON public.meme_tags
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- 3. 관리자만 파일 업로드/수정/삭제 가능하도록 설정
-- 파일 업로드 (INSERT)
CREATE POLICY "관리자만 파일 업로드 가능" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'memes' AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- 파일 업데이트 (UPDATE)
CREATE POLICY "관리자만 파일 수정 가능" ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'memes' AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- 파일 삭제 (DELETE)
CREATE POLICY "관리자만 파일 삭제 가능" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'memes' AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "모든 사용자 파일 조회 가능" ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'memes');

-- 1. 사용자 역할을 확인하는 함수 생성
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role FROM profiles WHERE id = auth.uid();
  RETURN user_role = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. 함수를 사용하여 정책 생성
CREATE POLICY "관리자는 모든 프로필 확인 가능" ON profiles
  FOR SELECT USING (
    is_admin() OR auth.uid() = id
  );

-- 간단한 사용자 처리 트리거 함수
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (NEW.id, 'user');  -- 모든 신규 사용자는 'user' 역할로 시작
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 트리거 설정
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

  -- 기존 사용자 마이그레이션 함수
CREATE OR REPLACE FUNCTION public.migrate_existing_users()
RETURNS void AS $$
DECLARE
  existing_user RECORD;
BEGIN
  -- auth.users 테이블에서 모든 사용자를 가져옴
  FOR existing_user IN (SELECT * FROM auth.users) LOOP
    -- 이미 profiles 테이블에 있는지 확인
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = existing_user.id) THEN
      -- 없으면 새 프로필 생성
      INSERT INTO public.profiles (
        id, 
        role, 
        display_name,
        created_at
      )
      VALUES (
        existing_user.id,
        'user',  -- 기본 역할
        COALESCE(existing_user.raw_user_meta_data->>'full_name', existing_user.email),
        existing_user.created_at
      );
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 기존 사용자 마이그레이션 실행
SELECT public.migrate_existing_users();

-- 마이그레이션 완료 후 함수 삭제 (선택사항)
-- DROP FUNCTION public.migrate_existing_users();
```

https://github.com/orgs/supabase/discussions/604 이런 api 좋다


```sql
BEGIN;
  DELETE FROM meme_tags;
  DELETE FROM memes;
  DELETE FROM storage.objects
  WHERE bucket_id = (
    SELECT id FROM storage.buckets WHERE name = 'memes'
  );
COMMIT;
```

programmerio는 영상은 없네

