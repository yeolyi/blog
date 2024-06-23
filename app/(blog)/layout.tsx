// import Header from '@/components/layout/Header';
import Header from '@/components/layout/Header';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <div className="w-full bg-white pb-[52px] pt-[44px] md:mx-auto md:mb-[64px] md:mt-[48px] md:w-[692px] md:pb-[60px] md:pt-[20px] lg:mt-[52px] lg:w-[816px] lg:pb-[80px]">
        <Header />
        <article className="prose prose-slate mx-auto w-[87.5%] lg:prose-lg max-md:max-w-[414px] md:w-[83.33%] lg:w-[80%]">
          {children}
        </article>
      </div>
    </main>
  );
}
