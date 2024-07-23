import { KeyboardEvent } from 'react';

export default function CodeTextArea({
  code,
  disabled,
  setCode,
}: {
  code: string;
  disabled: boolean;
  setCode?: (code: string) => void;
}) {
  return (
    <textarea
      name="code"
      aria-label="editor"
      autoCapitalize="off"
      autoComplete="off"
      spellCheck="false"
      className="absolute bottom-4 left-4 right-4 top-4 resize-none whitespace-pre bg-transparent font-firacode text-transparent caret-sky-500 outline-none "
      value={code}
      disabled={disabled}
      onChange={(e) => setCode?.(e.target.value)}
      onKeyDown={(e) => handleKeyDown(e)}
    />
  );
}

let getLineIndices = (str: string, idx: number) => {
  let lineStart = idx;
  while (lineStart > 0 && str[lineStart - 1] !== '\n') lineStart--;

  let wordStart = lineStart;
  while (str[wordStart] === ' ' || str[wordStart] === '\t') wordStart++;

  return { wordStart, lineStart };
};

let handleEnterKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
  let target = e.target as HTMLTextAreaElement;
  if (target.selectionStart !== target.selectionEnd) return;

  let selection = target.selectionStart;
  let lastLetter = target.value[selection - 1];

  let { wordStart, lineStart } = getLineIndices(target.value, selection);
  let blank = wordStart - lineStart + (lastLetter === '{' ? TAB.length : 0);
  if (blank === 0) return;

  // Insert carriage return and indented text
  // https://stackoverflow.com/questions/60581285/
  document.execCommand('insertText', false, `\n${' '.repeat(blank)}`);
  e.preventDefault();
};

let TAB = '  ';

let handleTabKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
  let target = e.target as HTMLTextAreaElement;

  if (target.selectionStart === target.selectionEnd) {
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
function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
  switch (e.key) {
    case 'Enter':
      handleEnterKeyDown(e);
      break;
    case 'Tab':
      e.preventDefault();
      handleTabKeyDown(e);
      break;
  }
}
