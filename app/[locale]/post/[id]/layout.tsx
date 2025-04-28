import localFont from 'next/font/local';

import '@xyflow/react/dist/style.css';
import '../../../../mdx/it-was-all-nand/Nand/style.css';

const monoplexKR = localFont({
  src: './assets/MonoplexKR-Text.ttf',
  variable: '--font-monoplex-kr',
});

export default async function PostLayout({
  children,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  return (
    <div
      className={`${monoplexKR.variable} max-w-2xl mx-auto mt-[12vh] mb-32 px-4 grow`}
    >
      {children}
    </div>
  );
}
