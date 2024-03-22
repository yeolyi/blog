import type { MDXComponents } from 'mdx/types';
import { Code } from 'bright';
import HTMLSandpack from './components/CustomSandpack';

Code.theme = 'github-light';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    pre: (props) => <pre className={props.className ?? 'not-prose'}>{props.children}</pre>,
    code: (props) => {
      if (props.className === 'language-js_preview')
        return <HTMLSandpack code={props.children!.toString().trim()} type="preview" />;
      else if (props.className === 'language-js_console')
        return <HTMLSandpack code={props.children!.toString().trim()} type="console" />;

      return <Code>{props.children}</Code>;
    },
  };
}
