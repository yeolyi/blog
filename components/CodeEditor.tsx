import hljs from 'highlight.js/lib/core';
import js from 'highlight.js/lib/languages/javascript';
import 'highlight.js/styles/github.css';

hljs.registerLanguage('javascript', js);

export default function CodeEditor({
  code,
  setCode,
}: {
  code: string;
  setCode: (code: string) => void;
}) {
  let highlightedCode = hljs.highlight(code, { language: 'javascript' }).value;

  if (highlightedCode === '') highlightedCode = ' ';
  // TODO: 해결책 찾기
  if (highlightedCode[highlightedCode.length - 1] === '\n')
    highlightedCode += ' ';

  return (
    <div className="relative bg-slate-50 p-4 shadow">
      <code
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
        style={{ fontFamily: 'Fira Code' }}
      />
      <textarea
        value={code}
        onKeyDown={(e) => {
          if (e.key === 'Tab') {
            e.preventDefault();
            setCode(code + '  ');
          }
        }}
        onChange={(e) => {
          setCode(e.target.value);
        }}
        autoCapitalize="off"
        autoComplete="off"
        spellCheck="false"
        className="absolute bottom-4 left-4 right-4 top-4 resize-none bg-transparent text-transparent caret-sky-600 outline-none"
      />
    </div>
  );
}
