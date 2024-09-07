# [yeolyi.com](https://yeolyi.com)

이곳에 공부한 것들을 기록하고 배운 것들을 적용하고 흥미로운 기술을 써먹어봅니다.

블로그 개발기: https://yeolyi.com/post/blog-ssr

## 🚀 실행 방법

우선 레포를 클론받은 뒤 패키지를 설치합니다.

```sh
pnpm install
```

manifest 파일이 존재해야하기에 아래 명령어로 만들어줍니다.

```sh
mkdir -p dist/client/.vite
echo {} > dist/client/.vite/manifest.json
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

## 📁 폴더 구조

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
