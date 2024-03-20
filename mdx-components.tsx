import type { MDXComponents } from 'mdx/types';
import { Code } from 'bright';

Code.theme = 'github-light';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    pre: Code,
  };
}
