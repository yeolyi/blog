import Sandbox from './Sandbox';

type SandboxProps = {
  src: string;
  language?: string;
};

export default function Code({ src, language }: SandboxProps) {
  let { attr, code } = parseSrc(src);

  switch (language) {
    case 'language-js':
      return (
        <Sandbox
          code={code}
          options={{
            type: attr.babel ? 'babel' : 'js',
            executeDisabled: attr.noexec,
          }}
        />
      );
    case 'language-html':
      return (
        <Sandbox
          code={code}
          options={{ type: 'html', executeDisabled: attr.noexec }}
        />
      );
    default:
      return <code>{code}</code>;
  }
}

let parseSrc = (src: string) => {
  if (src.startsWith('// @') === false) return { attr: {}, code: src };

  let idx = src.indexOf('\n');
  let attrStr = src.slice(0, idx);
  let code = src.slice(idx + 1);

  return {
    attr: {
      noexec: attrStr.includes('noexec'),
      babel: attrStr.includes('babel'),
    },
    code,
  };
};
