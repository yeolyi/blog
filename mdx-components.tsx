import type { MDXComponents } from 'mdx/types';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    a(props) {
      // 현재 창에서 열리면 뒤로가기로 되돌아갔을 때 상태(details 열림 상태 등)가 초기화됨.
      if (props.href?.startsWith('https://')) {
        return <a {...props} target="_blank" rel="noopener noreferrer" />;
      }
      // 그렇다고 내 블로그를 새 창으로 여는건 비직관적이므로...
      return <a {...props} />;
    },
  };
}
