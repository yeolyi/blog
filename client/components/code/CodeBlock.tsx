import { ReactElement, ReactNode } from 'react';

import HighlightedCode from './editor/HighlightedCode';
import { PresetName, presetNameList } from './sandbox/preset/presetMap';
import Sandbox, { SandboxProps } from './sandbox/Sandbox';

export default function CodeBlock({ children }: { children?: ReactNode }) {
  const fallback = <pre>{children}</pre>;

  // fallback
  if (!isReactElement(children)) return fallback;
  if (!children || children.type !== 'code') return fallback;

  const content = String(children.props.children).trim();
  const className = children.props.className;

  // 편집 불가능한 경우
  if (className === 'language-css') {
    return <HighlightedCode language="css">{content}</HighlightedCode>;
  } else if (className === 'langauge-shell') {
    return <HighlightedCode>{content}</HighlightedCode>;
  }

  // 편집 가능한 경우
  const { presetName, code, ...props } = parseProps(content, className);
  if (code === undefined || presetName === undefined) {
    return <HighlightedCode>{content}</HighlightedCode>;
  }

  return <Sandbox presetName={presetName} code={code} {...props} />;
}

const isReactElement = (node: ReactNode): node is ReactElement => {
  return typeof node === 'object' && node !== null && 'type' in node;
};

const parseProps = (
  src: string,
  className?: string,
): Partial<SandboxProps> & { presetName?: PresetName } => {
  const { code, options } = parseFirstLine(src);

  const presetName = presetNameList.find((name) => name in options);
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

const parseFirstLine = (src: string) => {
  const firstLine = src.split('\n')[0];
  if (firstLine === undefined) return { code: src, options: {} };

  if (!firstLine.includes('@')) return { code: src, options: {} };

  const idx = src.indexOf('\n');
  const attrStr = src.slice(src.indexOf('@') + 1, idx);
  const code = src.slice(idx + 1);

  const options = attrStr
    .split(' ')
    .reduce<{ [key: string]: boolean | number }>((acc, cur) => {
      if (cur.includes('=')) {
        const [key, val] = cur.split('=');
        acc[key] = Number(val);
      } else {
        acc[cur] = true;
      }
      return acc;
    }, {});

  return { code, options };
};
