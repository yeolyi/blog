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

ALTER TABLE public.profiles 
ADD COLUMN registration_number SERIAL;

-- 이후 버킷을 public으로 설정
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

---

맞는 지적입니다! 일반적인 프로미스는 생성되자마자 실행됩니다. 하지만 Supabase 쿼리 빌더는 조금 특별하게 작동합니다.

Supabase 쿼리 빌더는 실제 프로미스가 아니라 빌더 패턴을 구현한 객체를 반환합니다. 즉:

```typescript
let query = supabase.from("memes").select(`...`);
```

여기서 `query`는 실제 프로미스가 아니라 쿼리를 정의하는 객체입니다. 이 객체는 실제 HTTP 요청을 보내지 않습니다.

실제 HTTP 요청과 데이터베이스 접근은 이 객체에 다음과 같은 방법으로 접근할 때 발생합니다:

1. `await query`를 호출할 때
2. `query.then()`을 호출할 때
3. `.single()`, `.maybeSingle()` 같은 최종 실행 메서드를 호출할 때

이런 지연 실행(lazy execution) 패턴은 쿼리를 조합하고 수정할 수 있는 유연성을 제공합니다. 실제 요청은 최종적으로 데이터가 필요한 시점에만 실행됩니다.

그래서 `await Promise.all([query, countQuery])`에서 실제 데이터베이스 쿼리가 실행되는 것입니다.

---

네, 정확합니다. Supabase 쿼리 빌더는 PromiseLike 객체(또는 Thenable 객체)를 활용한다고 볼 수 있습니다.

PromiseLike 객체란:

- `.then()` 메서드를 구현해 Promise처럼 동작
- `await`과 함께 사용 가능
- 하지만 실제 Promise 인스턴스는 아님

Supabase 쿼리 빌더는:

1. 쿼리 정의용 메서드 체이닝을 지원하는 빌더 객체
2. `.then()`을 구현해 Promise처럼 사용 가능하게 함
3. 실제 HTTP 요청은 `.then()` 또는 `await`이 호출될 때 시작됨

이렇게 하면 쿼리를 미리 정의해두고 실제 데이터가 필요한 시점에 실행할 수 있다는 장점이 있습니다. 즉 지연 실행(lazy execution) 패턴을 구현하면서도 Promise와 호환되는 방식으로 동작하게 만든 것입니다.

---

zod도 써보자

---

[Error: Failed to find Server Action "409e6c69c2216d01d51c5068d86b019ef1552d6fca". This request might be from an older or newer deployment. Original error: Cannot read properties of undefined (reading 'workers')
Read more: https://nextjs.org/docs/messages/failed-to-find-server-action]

이런 에러도 있구나...

---

Tailwind
Tailwind is great. Yet, if you plan to use Radix Themes with Tailwind, keep in mind how its ergonomics may encourage you to create complex styles on the fly, sometimes reaching into the component internals without friction.

Tailwind is a different styling paradigm, which may not mix well with the idea of a closed component system where customization is achieved through props, tokens, and creating new components on top of a shared set of building blocks.

---

아래는 The Creative Momentum의 포스팅에서 소개한 네오 브루탈리즘의 대략적인 

- 특징들을 나열해 놓은 것이다.
- 검은색 또는 흰색 배경
- 그라데이션이나 음영을 사용하지 않음
- 구성요소들을 겹쳐 놓음
- 대칭적인 요소가 없음
- 번잡한 디자인
- 분명한 위계질서가 없음
- 폭이 일정한 타이포그래피
- 전체적으로 하나의 폰트만 사용
- 대비가 강한 컬러 팔레트
- 애니메이션을 거의 사용하지 않음
- 이미지가 거의 없음
- 네비게이션이 단순하거나 아예 없음
- 싱글 페이지(Single-page) 웹사이트 디자인

- - - 

https://www.reddit.com/r/nextjs/comments/17ti9zu/fast_app_on_localhost_is_incredibly_slow_on/

There's many things this could be, but the first to check would be the **physical locations of things**. For example, if you Supabase database is in us-east, and your Vercel Functions are in eu-east, then you're already fighting an uphill battle from the start. So first, ensure your functions and your database are in the same region (closest to your users).

> 진짜 빨라진듯?

Second, you need to consider where and when you need fresh data on every request. You mention navigating between pages can be slow. This is likely because you're not using any caching (you're directly communicating with Supabase) and could be potentially making a slow query, or fetching a lot of data.

Since the Supabase client does not use fetch, you can use unstable_cache to wrap your database queries, allowing you to provide revalidation periods or cache tags. If you use cache tags, for example, you can "purge" the data when you do any data mutations. E.g. you add a new user, great, now purge the cache tag "users" so you fetch the new list of users.

If you are fetching data that needs to be fresh on every request, but you're also calling that function multiple times, then you can use React's cache function to prevent repeat calls for that request.

https://stackoverflow.com/questions/23803743/what-is-the-explicit-promise-construction-antipattern-and-how-do-i-avoid-it

- - - 

이미지 다운로드 -> 안되는 부분/값싼부분(로컬 네트워크 접속, db 접속이 아닌) 먼저 해서 빨리 실패하게 하기. 

supabase에서 용량 초과로 에러가 뜰줄은...

- - - 

https://github.com/vercel/next.js/issues/64434

`next.config.mjs`로 바꾸니까 되네 진짜 실화냐

esm only라서 뭔가 꼬인건가

- - - 

https://github.com/vercel/next.js/discussions/59347

eslint 싫어하는 사람들이 많다. 

forEach may lead to performance issues when working with large arrays. When combined with functions like filter or map, this causes multiple iterations over the same type.

This else clause can be omitted because previous branches break early.

Importing the types with import type ensures that they are removed by the compilers and avoids loading unnecessary modules.
  
The default type of a button is submit, which causes the submission of a form when placed inside a `form` element. This is likely not the behaviour that you want inside a React application.
  
https://biomejs.dev/linter/rules/use-nodejs-import-protocol/

https://biomejs.dev/linter/rules/use-key-with-click-events/

Husky is a widely-used hook manager in the JavaScript ecosystem. Husky doesn’t hide unstaged changes and is not able to provide the list of staged files. This is why it is often used in tandem with another tool such as lint-staged or git-format-staged.

