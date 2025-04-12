import DOMPurify from 'isomorphic-dompurify';
import { marked } from 'marked';

// 마크다운 옵션 설정
marked.use({
  gfm: true, // GitHub Flavored Markdown 활성화
  breaks: true, // 줄바꿈 허용
});

export function renderMarkdown(text: string): string {
  const rawHtml = marked.parse(text, {
    async: false,
  }) as string;

  const cleanHtml = DOMPurify.sanitize(rawHtml);

  return cleanHtml;
}
