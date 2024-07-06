import hljs from 'highlight.js/lib/core';
import js from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import 'highlight.js/styles/github.css';
import { KeyboardEvent as KeyboardEventReact, ReactNode } from 'react';

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
  let highlightedCode = highlightCode(code, language);

  return (
    <div>
      <div className={`relative overflow-x-scroll rounded bg-slate-50`}>
        <div className="relative h-fit min-h-full w-fit min-w-full p-4 font-firacode text-sm leading-[1.4rem]">
          <pre
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
            className="h-full w-full text-nowrap not-italic"
          />
          <textarea
            name="code"
            aria-label="editor"
            autoCapitalize="off"
            autoComplete="off"
            spellCheck="false"
            className="absolute bottom-4 left-4 right-4 top-4 resize-none whitespace-pre bg-transparent text-transparent caret-sky-500 outline-none"
            value={code}
            disabled={noneditable}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, setCode)}
          />
        </div>
      </div>
      <div className="absolute right-3 top-4 flex items-center gap-2 font-firacode text-[12px] text-neutral-400">
        {presetName.toLocaleUpperCase()}
        {toolbar}
      </div>
    </div>
  );
}

// TODO: newline 처리 더 깔끔하게
let highlightCode = (code: string, language: string) => {
  let highlightedCode = hljs.highlight(code, { language }).value;

  if (highlightedCode === '') highlightedCode = ' ';
  if (highlightedCode[highlightedCode.length - 1] === '\n')
    highlightedCode += ' ';

  return highlightedCode;
};

let getLineIndices = (str: string, idx: number) => {
  let lineStart = idx;
  while (lineStart > 0 && str[lineStart - 1] != '\n') lineStart--;

  let wordStart = lineStart;
  while (str[wordStart] == ' ' || str[wordStart] == '\t') wordStart++;

  return { wordStart, lineStart };
};

let handleEnterKeyDown = (e: KeyboardEventReact<HTMLTextAreaElement>) => {
  let target = e.target as HTMLTextAreaElement;
  if (target.selectionStart !== target.selectionEnd) return;

  let selection = target.selectionStart;
  let lastLetter = target.value[selection - 1];

  let { wordStart, lineStart } = getLineIndices(target.value, selection);
  let blank = wordStart - lineStart + (lastLetter === '{' ? TAB.length : 0);
  if (blank === 0) return;

  // Insert carriage return and indented text
  // https://stackoverflow.com/questions/60581285/
  document.execCommand('insertText', false, '\n' + ' '.repeat(blank));
  e.preventDefault();
};

let TAB = '  ';

let handleTabKeyDown = (
  e: KeyboardEventReact<HTMLTextAreaElement>,
  setCode: (val: string) => void,
) => {
  let target = e.target as HTMLTextAreaElement;

  if (target.selectionStart == target.selectionEnd) {
    // undoable
    if (!e.shiftKey) {
      document.execCommand('insertText', false, TAB);
    } else {
      let { wordStart, lineStart } = getLineIndices(
        target.value,
        target.selectionStart,
      );

      let blank = wordStart - lineStart;
      if (blank < TAB.length) return;

      // TODO: undo 이후 selection 남는거 없애기
      let tmp = target.selectionStart;
      target.selectionStart = wordStart - TAB.length;
      target.selectionEnd = wordStart;
      document.execCommand('delete');
      target.selectionStart = target.selectionEnd = Math.max(0, tmp - 2);
    }
  } else {
    //
  }
};

// https://stackoverflow.com/questions/6637341/use-tab-to-indent-in-textarea
function handleKeyDown(
  e: KeyboardEventReact<HTMLTextAreaElement>,
  setCode: (val: string) => void,
) {
  switch (e.key) {
    case 'Enter':
      handleEnterKeyDown(e);
      break;
    case 'Tab':
      e.preventDefault();
      handleTabKeyDown(e, setCode);
      break;
  }
}
