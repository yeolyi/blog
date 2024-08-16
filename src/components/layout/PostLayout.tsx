import Giscus from '@/components/common/Giscus';
import Footer from '@/components/layout/Footer';
import Island from '@/components/layout/Island';
import { Outlet } from 'react-router-dom';

export default function PostLayout({
  discussionNumber,
}: {
  discussionNumber?: number;
}) {
  return (
    <>
      <main>
        <div className="w-full bg-white py-[100px] md:py-[120px]">
          <article className="prose prose-slate mx-auto w-[87.5%] lg:prose-lg prose-h1:text-[32px] max-md:max-w-[414px] md:w-[83.33%] md:prose-h1:text-[40px] lg:w-[80%] lg:prose-h1:text-[48px]">
            <Island />
            <Outlet />
            <div className="my-16 h-[1px] w-full bg-neutral-300" />
            <Giscus discussionNumber={discussionNumber} />
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
