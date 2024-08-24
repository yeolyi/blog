import CodeTextArea from './CodeTextArea';
import HighlightedCode from './HighlightedCode';

export default function CodeEditor({
  language,
  code,
  setCode,
  noneditable = false,
}: {
  language: string;
  code: string;
  setCode?: (code: string) => void;
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
