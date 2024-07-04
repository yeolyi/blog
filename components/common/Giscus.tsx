'use client';

import { useEffect, useRef, useState } from 'react';

export default function Giscus({
  discussionNumber,
}: {
  discussionNumber?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || ref.current.hasChildNodes()) return;

    const scriptElem = document.createElement('script');
    scriptElem.src = 'https://giscus.app/client.js';
    scriptElem.setAttribute('data-repo', 'yeolyi/blog');
    scriptElem.setAttribute('data-repo-id', 'R_kgDOKGpPEA');
    scriptElem.setAttribute('data-category', 'Announcements');
    scriptElem.setAttribute('data-category-id', 'DIC_kwDOKGpPEM4CfIcY');
    scriptElem.setAttribute(
      'data-mapping',
      discussionNumber ? 'number' : 'pathname',
    );
    if (discussionNumber)
      scriptElem.setAttribute('data-term', discussionNumber.toString());
    scriptElem.setAttribute('data-strict', '0');
    scriptElem.setAttribute('data-reactions-enabled', '1');
    scriptElem.setAttribute('data-emit-metadata', '0');
    scriptElem.setAttribute('data-input-position', 'top');
    scriptElem.setAttribute('data-theme', 'noborder_light');
    scriptElem.setAttribute('data-lang', 'ko');
    scriptElem.crossOrigin = 'anonymous';
    scriptElem.async = true;

    ref.current.appendChild(scriptElem);
  }, [discussionNumber]);

  return <div className="giscus" ref={ref} />;
}
