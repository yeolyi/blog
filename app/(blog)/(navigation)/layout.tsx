import Navigation from '@/components/nav/Navigation';
import Script from 'next/script';
import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
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
        crossOrigin="anonymous"
        async
      />
      <Navigation />
      {children}
      <div className="my-16 h-[1px] w-full bg-neutral-300" />
      <div className="giscus" />
    </>
  );
}
