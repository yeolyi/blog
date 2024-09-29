import { useEffect, useRef } from 'react';

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
    scriptElem.setAttribute(
      'data-theme',
      matchMedia('(prefers-color-scheme: dark)').matches ? 'noborder_dark' : (
        'noborder_light'
      ),
    );
    scriptElem.setAttribute('data-lang', 'ko');
    scriptElem.setAttribute('data-loading', 'lazy');
    scriptElem.crossOrigin = 'anonymous';
    scriptElem.async = true;

    ref.current.appendChild(scriptElem);

    return () => {
      ref.current?.removeChild(scriptElem);
    };
  }, [discussionNumber]);

  useEffect(() => {
    const handleThemeChange = ({ matches }: MediaQueryListEvent) => {
      changeGiscusTheme(matches ? 'dark' : 'light');
    };

    const mediaQueryList = matchMedia('(prefers-color-scheme: dark)');
    mediaQueryList.addEventListener('change', handleThemeChange);

    return () => {
      mediaQueryList.removeEventListener('change', handleThemeChange);
    };
  }, []);

  return <div className="giscus" ref={ref} />;
}

function changeGiscusTheme(theme: 'light' | 'dark') {
  const iframe = document.querySelector(
    'iframe.giscus-frame',
  ) as HTMLIFrameElement;
  if (!iframe) return;

  iframe.contentWindow?.postMessage(
    { giscus: { setConfig: { theme } } },
    'https://giscus.app',
  );
}
