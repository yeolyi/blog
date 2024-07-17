import { ReactNode } from 'react';
import HighlightedCode from './HighlightedCode';
import CodeTextArea from './CodeTextArea';

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
  return (
    <div>
      <HighlightedCode
        overlay={
          <CodeTextArea code={code} setCode={setCode} disabled={noneditable} />
        }
        language={language}
      >
        {code}
      </HighlightedCode>
      <div className="absolute right-3 top-4 flex items-center gap-2 font-firacode text-[12px] text-neutral-400">
        {presetName.toLocaleUpperCase()}
        {toolbar}
      </div>
    </div>
  );
}
