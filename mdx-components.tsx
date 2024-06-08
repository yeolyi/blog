import type { MDXComponents } from 'mdx/types';
import JSSandbox from './components/code/JSSandbox';
import PreviewAnchor from './components/PreviewAnchor';
import HTMLSandbox from './components/code/HTMLSandbox';

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
          return <JSSandbox code={code} executable={executable} />;
        } else {
          return (
            <JSSandbox
              code={code.substring(code.indexOf('\n') + 1)}
              executable={executable}
            />
          );
        }
      } else if (props.className === 'language-html') {
        return <HTMLSandbox code={code} />;
      } else {
        return <code {...props} />;
      }
    },
    a: PreviewAnchor,
  };
}
