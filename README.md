A portal only changes the physical placement of the DOM node. In every other way, the JSX you render into a portal acts as a child node of the React component that renders it. For example, the child can access the context provided by the parent tree, and events bubble up from children to parents according to the React tree.

https://github.com/orgs/supabase/discussions/9214 왜!!!! 왜 insert가 안되나 했네

- avif 최적화
  - 1.4GB(아마) -> 80mb ㄷㄷㄷ  
- vercel로 puppeteer쓰려면 light 깔아야되고... chromium 따로 동적 로드 해야되고... 
  - https://nextjs.org/docs/app/api-reference/config/next-config-js/serverExternalPackages
  - puppeteer 이런건 이미 등록되어있는데 목적이 잘 와닿지 않는다. 빌드 과정을 살펴보자. 
  - 인스타는 잘 되는데 레딧은 네트워크 보안 페이지 뜬다. 결국 snoowoop? 활용함
  - 동일 환경 가져가려면 언어도 신경써야한다. 
  - local에서 되는데 prod에서 안되는게 반복돼서 힘들었다. serverless 환경... 시간 제한... 램 제한...
  - 이럴거면 EC2가 낫지 않을까하는 생각이 들다가도...
- https://nextjs.org/docs/app/api-reference/config/next-config-js/serverComponentsHmrCache supabase storage 업데이트할 때 에러 뜸. 목적은 좋다만...

# 메모

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

https://github.com/orgs/supabase/discussions/604 이런 api 좋다


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

https://github.com/vercel/next.js/discussions/59347 eslint 싫어하는 사람들이 많다. 

forEach may lead to performance issues when working with large arrays. When combined with functions like filter or map, this causes multiple iterations over the same type.

This else clause can be omitted because previous branches break early.

Importing the types with import type ensures that they are removed by the compilers and avoids loading unnecessary modules.
  
The default type of a button is submit, which causes the submission of a form when placed inside a `form` element. This is likely not the behaviour that you want inside a React application.
  
https://biomejs.dev/linter/rules/use-nodejs-import-protocol/

https://biomejs.dev/linter/rules/use-key-with-click-events/

Husky is a widely-used hook manager in the JavaScript ecosystem. Husky doesn't hide unstaged changes and is not able to provide the list of staged files. This is why it is often used in tandem with another tool such as lint-staged or git-format-staged.

마크다운 두 줄 띄는게 귀찮을 수 있는데, max width 포맷팅 생각하면 두 줄 띄는게 낫다. 글 쓸 때와 볼 때의 화면폭이 다를 수 있어서...

The width property represents the **intrinsic image width** in pixels. This property is used to infer the correct aspect ratio of the image and avoid layout shift during loading. It does not determine the rendered size of the image, which is controlled by CSS, similar to the width attribute in the HTML <img> tag.

https://github.com/yzhang-gh/vscode-markdown/issues/89#issuecomment-2228045372


