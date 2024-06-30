import type { MDXComponents } from 'mdx/types';
import PreviewAnchor from './components/PreviewAnchor';
import Code from './components/code/Code';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    pre: (props) => (
      <pre className={props.className ?? 'not-prose'}>{props.children}</pre>
    ),
    code: (props) => {
      const content = props.children?.toString() ?? '';
      const code = content.trim();
      return <Code language={props.className} src={code} />;
    },
    a: PreviewAnchor,
  };
}
