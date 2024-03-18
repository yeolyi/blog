'use client';

import { useState } from 'react';

export default function Main() {
  const [html, setHTML] = useState(initialHTML);

  return (
    <div className="flex flex-col gap-10">
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <textarea
        className="monospace h-[20ch] w-full resize-none whitespace-pre border p-4 focus:outline-neutral-500 "
        value={html}
        onChange={(e) => setHTML(e.target.value)}
      />
    </div>
  );
}

const initialHTML = `<img src="/profile.jpg" style="width: 256px; height: 128px; object-fit: cover; margin-top: 0" />
<h1>이성열 yeolyi</h1>
<p>배우고 익히는 재미로 사는 프론트엔드 개발자 이성열입니다.</p>
<p>인스타그램 <a href="https://instagram.com/yeolyii">@yeolyii</a>에서는 매일의 공부를 공유합니다.</p>
<a href="./about">./about</a>
`;
