import type { MDXComponents } from 'mdx/types';
import { Code } from 'bright';

Code.theme = 'one-dark-pro';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    pre: Code,
  };
}
