import { ReactElement, ReactNode } from 'react';

import HighlightedCode from './editor/HighlightedCode';
import { PresetName, presetNameList } from './sandbox/preset/presetMap';
import Sandbox, { SandboxProps } from './sandbox/Sandbox';

export default function CodeBlock({ children }: { children?: ReactNode }) {
  let fallback = <pre>{children}</pre>;

  // fallback
  if (!isReactElement(children)) return fallback;
  if (!children || children.type !== 'code') return fallback;

  let content = String(children.props.children).trim();
  let className = children.props.className;

  // 편집 불가능한 경우
  if (className === 'language-css') {
    return <HighlightedCode language="css">{content}</HighlightedCode>;
  } else if (className === 'langauge-shell') {
    return <HighlightedCode>{content}</HighlightedCode>;
  }

  // 편집 가능한 경우
  let { presetName, code, ...props } = parseProps(content, className);
  if (code === undefined || presetName === undefined) {
    return <HighlightedCode>{content}</HighlightedCode>;
  }

  return <Sandbox presetName={presetName} code={code} {...props} />;
}

let isReactElement = (node: ReactNode): node is ReactElement => {
  return typeof node === 'object' && node !== null && 'type' in node;
};

let parseProps = (
  src: string,
  className?: string,
): Partial<SandboxProps> & { presetName?: PresetName } => {
  let { code, options } = parseFirstLine(src);

  let presetName = presetNameList.find((name) => name in options);
  if (presetName) return { presetName, code, ...options };

  // fallback
  if (className === 'language-html') {
    return { presetName: 'html', code, ...options };
  } else if (className === 'language-js') {
    return { presetName: 'js', code, ...options };
  } else {
    return {};
  }
};

let parseFirstLine = (src: string) => {
  let firstLine = src.split('\n')[0];
  if (firstLine === undefined) return { code: src, options: {} };

  if (!firstLine.includes('@')) return { code: src, options: {} };

  let idx = src.indexOf('\n');
  let attrStr = src.slice(src.indexOf('@') + 1, idx);
  let code = src.slice(idx + 1);

  let options = attrStr
    .split(' ')
    .reduce<{ [key: string]: boolean | number }>((acc, cur) => {
      if (cur.includes('=')) {
        let [key, val] = cur.split('=');
        acc[key] = Number(val);
      } else {
        acc[cur] = true;
      }
      return acc;
    }, {});

  return { code, options };
};
