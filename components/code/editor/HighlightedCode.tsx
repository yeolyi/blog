import { highlightCode } from '@/util/highlight';
import { ReactNode } from 'react';

export default function HighlightedCode({
  overlay,
  language,
  children,
}: {
  overlay?: ReactNode;
  language: string;
  children: string;
}) {
  return (
    <div className={`relative overflow-x-scroll rounded bg-slate-50`}>
      <div className="relative h-fit min-h-full w-fit min-w-full p-4 text-sm leading-[1.4rem]">
        <pre
          dangerouslySetInnerHTML={{
            __html: highlightCode(children, language),
          }}
          className="h-full w-full text-nowrap font-firacode not-italic "
        />
        {overlay}
      </div>
    </div>
  );
}
