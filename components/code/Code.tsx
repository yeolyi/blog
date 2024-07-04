import { DetailedHTMLProps, HTMLAttributes } from 'react';
import { PresetName, presetNameList } from './preset/preset';
import Sandbox, { SandboxProps } from './sandbox/Sandbox';

export default function Code(
  codeProps: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>,
) {
  let content = codeProps.children?.toString()?.trim();
  let className = codeProps.className;
  if (content === undefined || className === undefined)
    return <code {...codeProps} />;

  let { presetName, code, ...props } = parseProps(content, className);
  if (presetName === undefined || code === undefined)
    return <code>{content}</code>;

  return <Sandbox presetName={presetName} code={code} {...props} />;
}

let parseProps = (
  src: string,
  className: string,
): Partial<SandboxProps> & { presetName?: PresetName } => {
  let { code, options } = parseFirstLine(src);
  let executeDisabled = options.has('noexec');

  let presetName = presetNameList.find((name) => options.has(name));

  if (presetName) return { presetName, code, executeDisabled };

  // fallback
  if (className === 'language-html') {
    return { presetName: 'html', code, executeDisabled };
  } else if (className === 'language-js') {
    return { presetName: 'js', code, executeDisabled };
  } else {
    return {};
  }
};

let parseFirstLine = (src: string) => {
  if (!src.startsWith('// @')) return { code: src, options: new Set() };

  let idx = src.indexOf('\n');
  let attrStr = src.slice(src.indexOf('@') + 1, idx);
  let code = src.slice(idx + 1);
  let options = new Set(attrStr.split(' '));

  return { code, options };
};
