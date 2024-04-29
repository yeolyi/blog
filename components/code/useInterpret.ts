import { useState, useEffect } from 'react';
import { Log } from './log';
// @ts-expect-error TODO
import * as _Babel from '@babel/standalone';

export const useInterpret = (_code: string) => {
  const [iframe, setIframe] = useState<HTMLIFrameElement | null>(null);
  const [code, setCode] = useState(_code);
  const [logList, setLogList] = useState<Log[]>([]);

  useEffect(() => {
    if (iframe === null) return;
    setLogList([]);

    const id = setTimeout(() => {
      iframe.contentWindow?.postMessage('location.reload()', '*');
      try {
        const newCode = parseCode(code);
        iframe?.contentWindow?.postMessage(newCode, '*');
      } catch {
        iframe?.contentWindow?.postMessage(code, '*');
      }
    }, 800);

    return () => clearTimeout(id);
  }, [code, iframe]);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (iframe === null) return;
      if (e.origin === 'null' && e.source === iframe.contentWindow) {
        setLogList((list) => [...list, e.data]);
      }
    };

    addEventListener('message', handleMessage);
    return () => removeEventListener('message', handleMessage);
  }, [iframe]);

  return { code, setCode, setIframe, logList };
};

// https://dev.to/jser_zanp/how-to-detect-infinite-loop-in-javascript-28ih
const parseCode = (code: string) => {
  const Babel: any = _Babel;
  const parser = Babel.packages.parser;
  const traverse = Babel.packages.traverse.default;
  const generate = Babel.packages.generator.default;

  const ast = parser.parse(code);
  const prefix = `
var __count = 0
var __detectInfiniteLoop = () => {
  if (__count > 1000) {
    throw new Error('Infinite Loop detected.')
  }
  __count += 1
}
`;
  const detector = parser.parse(`__detectInfiniteLoop()`);
  const f = (path: any) => {
    path.node.body.body.push(...detector.program.body);
  };

  traverse(ast, { ForStatement: f, WhileStatement: f, DoWhileStatement: f });

  return prefix + generate(ast).code;
};
