import Header from '@/components/layout/Header';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  /* https://play.tailwindcss.com/uj1vGACRJA?layout=preview 참조 */
  return (
    <main className="flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-16 lg:py-24">
      <div className="relative w-full bg-white px-6 py-12 shadow-xl shadow-slate-700/10 ring-1 ring-gray-900/5 md:mx-auto md:max-w-3xl lg:max-w-4xl lg:pb-28 lg:pt-16">
        <div className="prose prose-slate mx-auto my-8 break-keep lg:prose-lg">
          <Header />
          {children}
        </div>
      </div>
    </main>
  );
}
