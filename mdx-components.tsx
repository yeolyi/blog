import type { MDXComponents } from 'mdx/types';

import CodeBlock from './components/code/CodeBlock';
import PreviewAnchor from './components/common/PreviewAnchor';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    pre: CodeBlock,
    a: PreviewAnchor,
  };
}
