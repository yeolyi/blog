import Comments from '@/app/[locale]/post/[id]/components/Comment';
import TableOfContents from '@/app/[locale]/post/[id]/components/TableOfContents';
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
      className={`${monoplexKR.variable} max-w-2xl mx-auto mt-[12vh] mb-32 px-4`}
    >
      <div className="prose prose-invert mb-12">{children}</div>
      <Comments postId={id} />
      <div className="fixed top-[15vh] left-[calc(50vw+24rem)] hidden xl:block">
        <TableOfContents />
      </div>
    </div>
  );
}
