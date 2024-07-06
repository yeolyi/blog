import hljs from 'highlight.js/lib/core';
import js from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import 'highlight.js/styles/github.css';
import { KeyboardEventHandler, ReactNode } from 'react';

hljs.registerLanguage('javascript', js);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('css', css);

export default function CodeEditor({
  language,
  code,
  setCode,
  presetName,
  noneditable = false,
  toolbar,
}: {
  language: string;
  code: string;
  setCode: (code: string) => void;
  presetName: string;
  noneditable?: boolean;
  toolbar?: ReactNode;
}) {
  const { highlightedCode, handleKeyDown } = useEditor(code, setCode, language);

  return (
    <div>
      <div className={`relative overflow-x-scroll rounded bg-slate-50`}>
        <div className="relative h-fit min-h-full w-fit min-w-full p-4 text-sm leading-[1.4rem]">
          <pre
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
            className="h-full w-full text-nowrap font-firacode not-italic"
          />
          <textarea
            name="code"
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
            disabled={noneditable}
          />
        </div>
      </div>
      <div className="absolute right-3 top-2 flex items-center gap-2 font-firacode text-[12px] text-neutral-400">
        {toolbar}
        {presetName.toLocaleUpperCase()}
      </div>
    </div>
  );
}

const useEditor = (
  code: string,
  _setCode: (val: string) => void,
  language: string,
) => {
  let highlightedCode = hljs.highlight(code, { language }).value;

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
