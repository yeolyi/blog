import { DetailedHTMLProps, HTMLAttributes } from 'react';
import Sandbox, { SandboxProps } from './sandbox/Sandbox';
import { PresetName } from './preset/preset';

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
  let babel = options.has('babel');
  let rxjs = options.has('rxjs');

  if (className === 'language-html') {
    return { presetName: 'html', code, executeDisabled };
  }

  if (className === 'language-js') {
    if (rxjs) {
      return { presetName: 'rxjs', code, executeDisabled };
    }

    if (babel) {
      return { presetName: 'babel', code, executeDisabled };
    }

    return { presetName: 'js', code, executeDisabled };
  }

  return {};
};

let parseFirstLine = (src: string) => {
  if (!src.startsWith('// @')) return { code: src, options: new Set() };

  let idx = src.indexOf('\n');
  let attrStr = src.slice(src.indexOf('@') + 1, idx);
  let code = src.slice(idx + 1);
  let options = new Set(attrStr.split(' '));

  return { code, options };
};
