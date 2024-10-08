import './index.css';

import hljs from 'highlight.js/lib/core';
import css from 'highlight.js/lib/languages/css';
import js from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml';
import { ReactNode } from 'react';

hljs.registerLanguage('javascript', js);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('css', css);

type Props = {
  overlay?: ReactNode;
  language?: string;
  children: string;
};

export default function HighlightedCode({
  overlay,
  language,
  children,
}: Props) {
  const __html = language ? highlightCode(children, language) : children;

  return (
    <div
      className={`not-prose relative w-full overflow-x-scroll rounded bg-slate-50 dark:bg-stone-800`}
    >
      <div className="relative h-fit min-h-full w-fit min-w-full p-4 text-sm leading-[1.4rem]">
        <div
          dangerouslySetInnerHTML={{ __html }}
          className="h-full w-full whitespace-pre text-nowrap font-firacode not-italic"
        />
        {overlay}
      </div>
    </div>
  );
}

// TODO: newline 처리 더 깔끔하게
const highlightCode = (code: string, language: string) => {
  let highlightedCode = hljs.highlight(code, { language }).value;

  if (highlightedCode === '') highlightedCode = ' ';
  if (highlightedCode[highlightedCode.length - 1] === '\n')
    highlightedCode += ' ';

  return highlightedCode;
};
