export default function PostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-2xl mx-auto mt-40 mb-32 px-4 prose prose-invert">
      {children}
    </div>
  );
}
