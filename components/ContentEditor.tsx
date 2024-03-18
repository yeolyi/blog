'use client';

import { useEffect, useState } from 'react';
import { unified } from 'unified';
import rehypeFormat from 'rehype-format';
import rehypeStringify from 'rehype-stringify';
import rehypeDomParse from 'rehype-dom-parse';

const PADDING_REM = 1;
const LINE_HEIGHT_REM = 1.75;

export default function ContentEditor({ id }: { id: string }) {
  const [html, setHTML] = useState('');
  const lines = (html.match(/\n/g) || '').length + 1;

  useEffect(() => {
    (async () => {
      const html = document.getElementById(id)!.innerHTML;
      const file = await unified()
        .use(rehypeDomParse)
        .use(rehypeFormat)
        .use(rehypeStringify)
        .process(html);
      const a = String(file).replace(/^\s+|\s+$/g, '');
      setHTML(a);
    })();
  }, [id]);

  return (
    <textarea
      className="monospace w-full resize-none overflow-y-hidden overflow-x-scroll whitespace-pre border text-sm"
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck="false"
      value={html}
      onChange={(e) => {
        setHTML(e.target.value);
        document.getElementById(id)!.innerHTML = e.target.value;
      }}
      style={{
        height: `${lines * LINE_HEIGHT_REM + 2 * PADDING_REM}rem`,
        padding: `${PADDING_REM}rem`,
        lineHeight: `${LINE_HEIGHT_REM}rem`,
      }}
    />
  );
}
