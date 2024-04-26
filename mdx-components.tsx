import type { MDXComponents } from 'mdx/types';
import { Code } from 'bright';
import JSInterpreter from './components/JSInterpreter';
import { ReactNode } from 'react';

Code.theme = 'github-light';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    pre: (props) => (
      <pre className={props.className ?? 'not-prose'}>{props.children}</pre>
    ),
    code: (props) => {
      const content = props.children?.toString() ?? '';
      const type = content.split('\n')[0].slice(3);
      const code = content.split('\n').slice(1).join('\n').trim();

      if (type === 'console') return <JSInterpreter code={code} />;
      else return <FallbackCode {...props} />;
    },
  };
}

const FallbackCode = ({ children }: { children?: ReactNode }) => (
  <Code>{children}</Code>
);
