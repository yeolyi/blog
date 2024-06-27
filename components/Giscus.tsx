import Script from 'next/script';

export default function Giscus({
  discussionNumber,
  notLazy = false,
}: {
  discussionNumber?: number;
  notLazy?: boolean;
}) {
  return (
    <>
      <Script
        src="https://giscus.app/client.js"
        strategy="lazyOnload" // link preload 에러 제거용
        data-repo="yeolyi/blog"
        data-repo-id="R_kgDOKGpPEA"
        data-category="Announcements"
        data-category-id="DIC_kwDOKGpPEM4CfIcY"
        data-mapping={discussionNumber ? 'number' : 'pathname'}
        data-term={discussionNumber}
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="top"
        data-theme="noborder_light"
        data-lang="ko"
        data-loading={notLazy ? undefined : 'lazy'}
        crossOrigin="anonymous"
        async
      />
      <div className="giscus" />
    </>
  );
}
