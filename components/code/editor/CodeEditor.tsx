import { ReactNode } from 'react';
import HighlightedCode from './HighlightedCode';
import CodeTextArea from './CodeTextArea';

export default function CodeEditor({
  language,
  code,
  setCode,
  noneditable = false,
}: {
  language: string;
  code: string;
  setCode: (code: string) => void;
  noneditable?: boolean;
}) {
  return (
    <HighlightedCode
      overlay={
        <CodeTextArea code={code} setCode={setCode} disabled={noneditable} />
      }
      language={language}
    >
      {code}
    </HighlightedCode>
  );
}
