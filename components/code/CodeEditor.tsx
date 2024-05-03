import hljs from 'highlight.js/lib/core';
import js from 'highlight.js/lib/languages/javascript';
import 'highlight.js/styles/github.css';
import { KeyboardEventHandler } from 'react';

hljs.registerLanguage('javascript', js);

export default function CodeEditor({
  code,
  setCode,
}: {
  code: string;
  setCode: (code: string) => void;
}) {
  const { highlightedCode, handleKeyDown } = useEditor(code, setCode);

  return (
    <div className="overflow-x-scroll bg-slate-50 shadow">
      <div className="relative h-fit min-h-full w-fit min-w-full p-4 text-base leading-6">
        <pre
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
          className="h-full w-full text-nowrap font-firacode"
        />
        <textarea
          aria-label="editor"
          defaultValue={code}
          onKeyDown={handleKeyDown}
          onChange={(e) => {
            setCode(e.target.value);
          }}
          autoCapitalize="off"
          autoComplete="off"
          spellCheck="false"
          className="absolute bottom-4 left-4 right-4 top-4 resize-none bg-transparent font-firacode text-transparent caret-sky-500 outline-none"
        />
      </div>
    </div>
  );
}

const useEditor = (code: string, _setCode: (val: string) => void) => {
  let highlightedCode = hljs.highlight(code, {
    language: 'javascript',
  }).value;

  if (highlightedCode === '') highlightedCode = ' ';
  // TODO: 해결책 찾기
  if (highlightedCode[highlightedCode.length - 1] === '\n')
    highlightedCode += ' ';

  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    const textarea = e.target as HTMLTextAreaElement;
    const code = textarea.value;
    const isCtrlZ = (e.metaKey || e.ctrlKey) && e.key === 'z';

    const setCode = (code: string) => {
      textarea.value = code;
      _setCode(code);
    };

    if (e.key === 'Tab') {
      e.preventDefault();

      const { selectionStart, selectionEnd } = textarea;

      const indent = '  ';
      const newValue = insertAt(code, indent, selectionStart);

      setCode(newValue);

      textarea.selectionStart = selectionStart + indent.length;
      textarea.selectionEnd = selectionEnd + indent.length;
    } else if (isCtrlZ) {
      // TODO
      e.stopPropagation();
    }
  };

  return { handleKeyDown, highlightedCode };
};

const insertAt = (str1: string, str2: string, idx: number) =>
  `${str1.slice(0, idx)}${str2}${str1.slice(idx)}`;
