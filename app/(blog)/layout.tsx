// import Header from '@/components/layout/Header';
import Header from '@/components/layout/Header';
import './blog.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <div>
        <Header />
        <article className="prose prose-slate lg:prose-lg">{children}</article>
      </div>
    </main>
  );
}
