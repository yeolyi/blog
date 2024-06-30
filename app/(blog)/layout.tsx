export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <div className="w-full bg-white py-[100px] md:py-[120px]">
        <article className="prose prose-slate mx-auto w-[87.5%] lg:prose-lg prose-h1:text-[32px] max-md:max-w-[414px] md:w-[83.33%] md:prose-h1:text-[40px] lg:w-[80%] lg:prose-h1:text-[48px]">
          {children}
        </article>
      </div>
    </main>
  );
}
