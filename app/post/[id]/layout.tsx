import Comment from '@/app/post/[id]/components/Comment';

import localFont from 'next/font/local';

const monoplexKR = localFont({
  src: './assets/MonoplexKR-Text.ttf',
  variable: '--font-monoplex-kr',
});

export default async function PostLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  return (
    <div
      className={`${monoplexKR.variable} max-w-2xl mx-auto mt-[12vh] mb-32 px-4 prose prose-invert`}
    >
      {children}
      <Comment id={id} />
    </div>
  );
}
