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

      if (props.className === 'language-js') {
        const executable = !code.startsWith('// @noexec');
        if (executable) {
          return <Sandbox code={code} executable={executable} />;
        } else {
          return (
            <Sandbox
              code={code.substring(code.indexOf('\n') + 1)}
              executable={executable}
            />
          );
        }
      } else return <code {...props} />;
    },
    a: PreviewAnchor,
  };
}
