import Script from 'next/script';

export default function Giscus() {
  return (
    <>
      <Script
        src="https://giscus.app/client.js"
        data-repo="yeolyi/blog"
        data-repo-id="R_kgDOKGpPEA"
        data-category="Announcements"
        data-category-id="DIC_kwDOKGpPEM4CfIcY"
        data-mapping="title"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="top"
        data-theme="noborder_light"
        data-lang="ko"
        data-loading="lazy"
        crossOrigin="anonymous"
        async
      />
      <div className="giscus" />
    </>
  );
}
