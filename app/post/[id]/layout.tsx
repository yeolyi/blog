import Comment from '@/app/post/[id]/components/Comment';

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
    <div className="max-w-2xl mx-auto mt-40 mb-32 px-4 prose prose-invert">
      {children}
      <Comment id={id} />
    </div>
  );
}
