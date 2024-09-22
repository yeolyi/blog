import CodeBlock from '@/client/components/code/CodeBlock';
import Giscus from '@/client/components/common/Giscus';
import Footer from '@/client/components/layout/Footer';
import Island from '@/client/components/layout/Island';
import { MdxPage } from '@/client/types/page';
import { MDXComponents } from 'mdx/types';
import { lazy, Suspense, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function MdxLayout({
  discussionNumber,
  mdxPage,
}: {
  discussionNumber?: number;
  mdxPage: MdxPage;
}) {
  const Mdx = lazy(mdxPage.importMdx);

  const { pathname } = useLocation();
  useLayoutEffect(() => {
    scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <main className="grow">
        {mdxPage.src && (
          <img
            src={mdxPage.src}
            alt="어렸을 때 사진"
            className="block h-[calc(100vh-350px)] max-h-[calc(((100vw*9)/16))] min-h-[calc(((100vw*9)/16)*0.57)] w-full object-cover"
            style={{
              objectFit: mdxPage.objectFit,
              padding: mdxPage.objectFit === 'cover' ? '' : '50px',
            }}
          />
        )}
        <div className="w-full bg-white pb-[100px] pt-[50px] md:pb-[120px] md:pt-[60px]">
          <article className="prose prose-slate mx-auto w-[87.5%] lg:prose-lg prose-h1:text-[32px] max-md:max-w-[414px] md:w-[83.33%] md:prose-h1:text-[40px] lg:w-[80%] lg:prose-h1:text-[48px]">
            <Island />
            <Suspense
              fallback={
                <div className="h-[100vh] w-full">
                  <h1 className="text-neutral-400">불러오는 중...</h1>
                </div>
              }
            >
              <Mdx components={mdxComponents} />
            </Suspense>
            <div className="my-16 h-[1px] w-full bg-neutral-300" />
            <Giscus discussionNumber={discussionNumber} />
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}

const mdxComponents: MDXComponents = {
  pre: CodeBlock,
};
