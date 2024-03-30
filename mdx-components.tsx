import type { MDXComponents } from 'mdx/types';
import { Code } from 'bright';
import HTMLSandpack from './components/CustomSandpack';
import { ReactNode } from 'react';

Code.theme = 'github-light';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    pre: (props) => <pre className={props.className ?? 'not-prose'}>{props.children}</pre>,
    code: (props) => {
      const content = props.children?.toString() ?? '';
      const type = content.split('\n')[0].slice(3);
      const code = content.split('\n').slice(1).join('\n').trim();

      if (type === 'preview' || type === 'console' || type === 'test')
        return <HTMLSandpack code={code} type={type} />;
      else return <FallbackCode {...props} />;
    },
  };
}

const FallbackCode = ({ children }: { children?: ReactNode }) => <Code>{children}</Code>;
