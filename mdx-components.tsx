import type { MDXComponents } from 'mdx/types';
import PreviewAnchor from './components/common/PreviewAnchor';
import Code from './components/code/Code';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    pre: (props) => (
      <pre className={props.className ?? 'not-prose'}>{props.children}</pre>
    ),
    code: Code,
    a: PreviewAnchor,
  };
}
