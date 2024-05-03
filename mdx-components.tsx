import type { MDXComponents } from 'mdx/types';
import Sandbox from './components/code/Sandbox';
import PreviewAnchor from './components/anchor/PreviewAnchor';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    pre: (props) => (
      <pre className={props.className ?? 'not-prose'}>{props.children}</pre>
    ),
    code: (props) => {
      const content = props.children?.toString() ?? '';
      const code = content.trim();

      if (props.className === 'language-js') return <Sandbox code={code} />;
      else return <code {...props} />;
    },
    a: PreviewAnchor,
  };
}
