import DOMPurify from 'isomorphic-dompurify';
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import { createHighlighter } from 'shiki';

const langs = ['js', 'ts', 'py', 'bash', 'md', 'json'];

const highlighter = await createHighlighter({
  themes: ['github-dark'],
  langs,
});

const marked = new Marked();

marked.use(
  markedHighlight({
    highlight(code, lang, info) {
      if (langs.includes(lang)) {
        return highlighter.codeToHtml(code, { lang, theme: 'github-dark' });
      }
      return code;
    },
  }),
);

marked.use({
  renderer: {
    code({ text }) {
      console.log(text);
      return text;
    },
  },
});

export async function renderMarkdown(text: string): Promise<string> {
  const rawHtml = await marked.parse(text);
  const cleanHtml = DOMPurify.sanitize(rawHtml);
  return cleanHtml;
}
