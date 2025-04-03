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
