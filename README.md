# blog

이곳에 공부한 것들을 기록하고 배운 것들을 적용하고 흥미로운 기술을 써먹어봅니다.

- [yeolyi.com](https://yeolyi.com)
- [Next.js가 싫은 사람의 블로그 개발기](https://yeolyi.com/post/blog-ssr)

## 🚀 실행 방법

우선 레포를 클론받은 뒤 패키지를 설치합니다. 패키지 관리자로 pnpm을 사용합니다.

```sh
pnpm install
```

`manifest.json` 파일이 존재해야하기에 아래 명령어로 만들어줍니다.

```sh
mkdir -p dist/client/.vite
echo {} > dist/client/.vite/manifest.json
```

이후 아래 중 원하는 작업을 수행합니다.

```sh
# 개발 서버 시작
pnpm run dev
# 빌드
pnpm run build
# (빌드 이후) 프로덕션 서버 시작
pnpm start
```

## 📁 폴더 구조

index.ts를 실행해 블로그 express 서버를 띄웁니다.

- /client: vite가 책임지는 부분입니다. 따라서 \*.mdx 파일 import가 가능하고 빌드
  시점에 code minify 등등 여러 최적화가 수행됩니다.
  - entry-client.tsx: SSR 과정에서 브라우저에서 실행되는 코드를 export합니다.
  - entry-server.tsx: SSR 과정에서 브라우저에서 실행되는 코드와 함께 vite를
    거쳐서 얻어야하는 데이터들(sitemap, rss 등)을 export합니다.
  - HTML.tsx: html 문서 전체를 렌더링합니다.
  - App.tsx: Routes 컴포넌트들을 렌더링합니다.
- /server: 서버에서만 실행되는 부분입니다. NextJS 시절에 server component에 있던
  fetch 코드를 옮겨왔습니다.
- /public: 정적 serving되는 파일들입니다. 대부분의 경우 vite의
  [Static Asset Handling](https://vitejs.dev/guide/assets)을 사용하므로 이곳에
  파일을 추가할 일은 크게 없습니다.
