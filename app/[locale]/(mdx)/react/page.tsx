import Code from '@/components/mdx/Code';
import { Link } from '@/i18n/navigation';
import { order } from '@/mdx/react';

export default async function PostPage() {
  const metadataList = await Promise.all(
    order.map(async (id) => {
      const { default: _, ...metadata } = await import(
        `@/mdx/react/${id}/ko.mdx`
      );
      return { id, ...metadata };
    }),
  );

  return (
    <div className="prose prose-stone dark:prose-invert">
      <h1>2025 리액트 기여자 되기</h1>
      <p>
        가장 많이 쓰는 라이브러리가 리액트인데 그만큼 깊게 이해하고 있는 것
        같지는 않아 리액트 소스코드를 공부하기로 했습니다. 어떤 개발자분 소개에
        '리액트 컨트리뷰터'가 있는게 멋져보이기도 했고요.
      </p>
      <p>
        다른 블로그 글들과 달리 이건 저도 잘 모르는 내용이라서 주저리주저리 느낀
        점들을 써나갈 예정입니다. 나중에 돌아보면 재밌을 것 같네요 🤗
      </p>
      <p>
        <a href="https://jser.dev/series/react-source-code-walkthrough">
          React source code deep dive 시리즈
        </a>
        의 도움을 많이 받았습니다. 자료의 커리큘럼을 따라 리액트 코드를
        살펴보면서 스스로 이해한 과정과 따로 찾아본 내용들을 기록했습니다.
      </p>

      <h2>시작하기 앞서</h2>
      <ol>
        {metadataList.slice(0, 2).map(({ id, title }) => (
          <li key={id}>
            <Link href={`/react/${id}`}>{title}</Link>
          </li>
        ))}
      </ol>
      <h2>처음 UI를 그리는 과정</h2>
      <p>아래 코드가 초기 렌더되기까지 벌어지는 일을 알아봅시다.</p>
      <Code
        template="react"
        files={{
          'App.js': `import { useState } from 'react';

function Link() {
  return <a href="https://yeolyi.com">yeolyi.com</a>;
}

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>
        <Link />
        <br />
        <button onClick={() => setCount((count) => count + 1)}>
          click me - {count}
        </button>
      </p>
    </div>
  );
}
          `,
        }}
      />
      <ol>
        {metadataList.slice(2, 10).map(({ id, title }) => (
          <li key={id}>
            <Link href={`/react/${id}`}>{title}</Link>
          </li>
        ))}
      </ol>

      <h2>UI를 다시 그리는 과정</h2>
      <p>아래 코드에서 버튼을 눌렀을 때 리렌더되는 과정을 따라가봅시다.</p>
      <Code
        template="react"
        files={{
          'App.js': `import { useState } from 'react';

function Link() {
  return <a href="https://yeolyi.com">yeolyi.com</a>;
}

function Component() {
  const [count, setCount] = useState(0);
  return (
    <div>
    <button onClick={() => setCount((count) => count + 1)}>
      click me - {count} 
    </button> ({count % 2 === 0 ? <span>even</span> : <b>odd</b>})
    </div>
  );
}

export default function App() {
  return (
    <div>
      <Link />
      <br />
      <Component />
    </div>
  );
}`,
        }}
      />
      <ol>
        {metadataList.slice(10, 15).map(({ id, title }) => (
          <li key={id}>
            <Link href={`/react/${id}`}>{title}</Link>
          </li>
        ))}
      </ol>

      <h2>리액트 훅 뜯어보기</h2>
      <ol>
        {metadataList.slice(15).map(({ id, title }) => (
          <li key={id}>
            <Link href={`/react/${id}`}>{title}</Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
