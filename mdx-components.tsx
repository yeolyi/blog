import type { MDXComponents } from 'mdx/types';
import PreviewAnchor from './components/common/PreviewAnchor';
import CodeBlock from './components/code/CodeBlock';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    pre: CodeBlock,
    a: PreviewAnchor,
  };
}
