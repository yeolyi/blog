import type { MDXComponents } from 'mdx/types';
import PreviewAnchor from './components/PreviewAnchor';
import Sandbox from './components/code/Sandbox';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    pre: (props) => (
      <pre className={props.className ?? 'not-prose'}>{props.children}</pre>
    ),
    code: (props) => {
      const content = props.children?.toString() ?? '';
      const code = content.trim();
      return <Sandbox language={props.className} src={code} />;
    },
    a: PreviewAnchor,
  };
}
