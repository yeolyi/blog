'use client';

import CodeEditor from './CodeEditor';
import Console from './Console';
import { useInterpret } from './useInterpret';

export default function JSInterpreter({ code: _code }: { code: string }) {
  const { ref, code, setCode, logList } = useInterpret(_code);

  return (
    <div className="flex flex-col gap-2">
      <CodeEditor code={code} setCode={setCode} />
      <Console logList={logList} />
      <iframe
        sandbox="allow-scripts"
        src="frame.html"
        ref={ref}
        className="h-0 w-0"
      />
    </div>
  );
}
