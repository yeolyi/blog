import {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useCallback,
  useRef,
} from 'react';
import { Log } from './log';
// @ts-expect-error TODO
import * as _Babel from '@babel/standalone';

export const useInterpret = (_code: string) => {
  const [iframe, setIframe] = useState<HTMLIFrameElement | null>(null);
  const [code, setCode] = useState(_code);
  const [logList, setLogList] = useState<Log[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (iframe === null) return;

    const loadHandler = () => setLoaded(true);
    iframe.addEventListener('load', loadHandler);
    return () => iframe.removeEventListener('load', loadHandler);
  }, [iframe]);

  useMessageListener(iframe, setLogList);
  useExecDebounce(iframe, code, setLogList, loaded);

  return { code, setCode, setIframe, logList };
};

const useExecDebounce = (
  iframe: HTMLIFrameElement | null,
  code: string,
  setLogList: Dispatch<SetStateAction<Log[]>>,
  loaded: boolean,
) => {
  const ref = useRef(true);

  const postMessage = useCallback(() => {
    if (iframe === null || loaded === false) return;
    ref.current = false;

    try {
      const newCode = parseCode(code);
      iframe.contentWindow?.postMessage('location.reload()', '*');
      iframe?.contentWindow?.postMessage(newCode, '*');
    } catch {
      iframe?.contentWindow?.postMessage(code, '*');
    }
  }, [code, iframe, loaded]);

  useEffect(() => {
    const id = setTimeout(postMessage, ref.current ? 0 : 800);
    setLogList([]);
    return () => clearTimeout(id);
  }, [postMessage, setLogList]);
};

const useMessageListener = (
  iframe: HTMLIFrameElement | null,
  setLogList: Dispatch<SetStateAction<Log[]>>,
) => {
  useEffect(() => {
    if (iframe === null) return;

    const handleMessage = (e: MessageEvent) => {
      if (e.origin === 'null' && e.source === iframe.contentWindow) {
        setLogList((list) => [...list, e.data]);
      }
    };

    addEventListener('message', handleMessage);
    return () => removeEventListener('message', handleMessage);
  }, [iframe, setLogList]);
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
