import HTMLSandbox from './HTMLSandbox';
import JSSandbox from './JSSandbox';

type SandboxProps = {
  src: string;
  language?: string;
};

type Attr = {
  executable: boolean;
};

export default function Sandbox({ src, language }: SandboxProps) {
  let { attr, code } = parseSrc(src);

  switch (language) {
    case 'language-js':
      return <JSSandbox executable={attr.executable} code={code} />;
    case 'language-html':
      return <HTMLSandbox code={code} />;
    default:
      return <code>{code}</code>;
  }
}

let defaultAttr: Attr = {
  executable: true,
};

let parseSrc = (src: string): { attr: Attr; code: string } => {
  if (src.startsWith('// @') === false) return { attr: defaultAttr, code: src };

  let idx = src.indexOf('\n');
  let attrStr = src.slice(0, idx);
  let code = src.slice(idx + 1);

  return {
    attr: {
      executable: !attrStr.includes('noexec'),
    },
    code,
  };
};
