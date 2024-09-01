# [yeolyi.com](https://yeolyi.com)

이곳에 공부한 것들을 기록하고 배운 것들을 적용하고 흥미로운 기술을 써먹어봅니다.

## 실행 방법

우선 레포를 클론받은 뒤 패키지를 설치합니다.

```sh
pnpm install
```

이후 원하는 작업을 수행합니다.

```sh
# 개발 서버 시작
pnpm run dev
# 빌드
pnpm run build
# (빌드 이후) 프로덕션 서버 시작
pnpm start
```

## 주요 사용 기술

Express 서버에서 react를 사용해 SSR을 합니다.

- 클라이언트
  - react
  - react-router-dom
  - tailwind
  - vite
  - MDX
- 서버
  - express
  - tsx

### Next.js to React

기존에는 Next.js를 사용했는데 다음과 같은 이유로 **react로 전환**했어요.

- 블로그 글이 길수록 VSCode에 쓴 MDX 글이 브라우저에 반영되는
  속도([fast refresh](https://nextjs.org/docs/architecture/fast-refresh))가 많이
  느려졌습니다. 심할 땐 10초정도 걸린 것 같아요.
- Next.js는 이런저런 작업을 대신 해주려는 경향이 강한데 이미지 최적화나 SSR같은
  작업을 low-level로 직접 만들어보고 싶었습니다.
- 블로그 기능 대비 Next.js는 꽤 무거운 프레임워크였습니다. 크지 않은
  블로그임에도 EC2 프리티어에서 빌드시 인스턴스가 터져버렸어요.
- ~~[nextJS 버그 개많음](https://2023.stateofjs.com/en-US/libraries/meta-frameworks/#meta_frameworks_pain_points)~~

### SSR

React로 바꾸긴 했지만 SPA는 싫어서 vite를 잘 섞어 SSR을 합니다. SEO를 챙기고
싶었고 react의
[renderToPipeableStream](https://react.dev/reference/react-dom/server/renderToPipeableStream)같은
것들을 직접 사용해보고싶었어요.

vite 문서의 [Server-Side Rendering](https://vitejs.dev/guide/ssr.html)과 react
router 문서의
[Server Side Rendering](https://reactrouter.com/en/main/guides/ssr)을 많이
참고했습니다.

### CI/CD

Push가 되면 GitHub action에서 EC2 인스턴스에 SSH 접속해 pull, build, pm2
reload를 수행합니다.

도메인은 route53에서 구매했고 https는 Caddy를 사용해 붙입니다.

도커도 함 써보고싶은데,,,

## 폴더 구조

크게 vite가 책임지는 부분과 vite 무관하게 서버에서 바로 실행되는 부분으로 나눌
수 있을 것 같습니다. ~~vite에 express를 우겨넣어 구조가 개판입니다.~~

주요 폴더/파일들에 대한 설명입니다:

- /client: vite가 책임지는 부분입니다. 따라서 \*.mdx 파일 import가 가능하고 빌드
  시점에 code minify 등등 여러 최적화가 수행됩니다.
  - entry-client.tsx: SSR 과정에서 브라우저에서 실행되는 코드를 export합니다.
  - entry-server.tsx: SSR 과정에서 브라우저에서 실행되는 코드와 함께 vite를
    거쳐서 얻어야하는 데이터들(sitemap, rss 등)을 export합니다.
  - App.tsx: Route를 포함한 html 문서 전체를 렌더링합니다.
- /server: 서버에서만 실행되는 부분입니다. NextJS 시절에 server component에 있던
  코드를 옮겨왔습니다.
- /public: 정적 serving되는 파일들입니다. 대부분의 경우 vite의
  [Static Asset Handling](https://vitejs.dev/guide/assets)을 사용하므로 이곳에
  파일을 추가할 일은 크게 없습니다.
