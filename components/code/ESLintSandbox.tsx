'use client';

import * as eslint from 'eslint-linter-browserify';
import { useState } from 'react';

import CodeEditor from './editor/CodeEditor';

const linter = new eslint.Linter();

export default function ESLintSandbox({
  config = {},
  code: _code = '',
}: {
  config?: eslint.Linter.Config;
  code?: string;
}) {
  let [code, setCode] = useState(_code);
  let results = linter.verify(code, config);
  let resultStr = results.map(({ ruleId, line, column, message, severity }) => {
    let str = `[${line}:${column}] ${message} (${ruleId})`;
    return severity === 2 ? <span className="text-red-400">{str}</span> : str;
  });

  return (
    <div className="not-prose flex flex-col gap-2">
      <CodeEditor
        language="js"
        code={JSON.stringify(config, null, 2)}
        noneditable
      />
      <CodeEditor language="js" code={code} setCode={setCode} />
      <p className="p-2 text-slate-500">{resultStr}</p>
    </div>
  );
}
