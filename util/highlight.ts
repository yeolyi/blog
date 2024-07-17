import hljs from 'highlight.js/lib/core';
import js from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import 'highlight.js/styles/github.css';

hljs.registerLanguage('javascript', js);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('css', css);

// TODO: newline 처리 더 깔끔하게
export let highlightCode = (code: string, language: string) => {
  let highlightedCode = hljs.highlight(code, { language }).value;

  if (highlightedCode === '') highlightedCode = ' ';
  if (highlightedCode[highlightedCode.length - 1] === '\n')
    highlightedCode += ' ';

  return highlightedCode;
};
