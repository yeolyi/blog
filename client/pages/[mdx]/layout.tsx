import CodeBlock from '@/client/components/code';
import Giscus from '@/client/components/common/Giscus';
import Footer from '@/client/components/layout/Footer';
import Island from '@/client/components/layout/island';
import MediumZoom from '@/client/components/image/MediumZoom';
import { MdxPage } from '@/client/types/page';
import { MDXComponents } from 'mdx/types';
import { lazy, Suspense, useEffect, useState } from 'react';
import { Fallback } from '@/client/pages/[mdx]/Fallback';
import { useLocation } from 'wouter';
import { mainPage, pageList } from '@/client/constants/page';
import { PageMeta } from '@/client/components/common/PageMeta';

export default function MdxLayout({
  discussionNumber,
  mdxPage,
}: {
  discussionNumber?: number;
  mdxPage: MdxPage;
}) {
  const [location] = useLocation();
  const page = pageList.find(({ path }) => path === location) ?? mainPage;

  const Mdx = lazy(mdxPage.importMdx);

  const [pathname] = useLocation();

  // https://gist.github.com/gaearon/e7d97cdf38a2907924ea12e4ebdf3c85
  // TODO: useLayoutEffect를 사용할 방법?
  useEffect(() => {
    scrollTo(0, 0);
  }, [pathname]);

  const [tmp, setTmp] = useState(false);
  useEffect(() => {
    setTmp(true);
  }, []);

  return (
    <>
      <PageMeta page={page} />
      <main>
        {mdxPage.src && (
          <img
            src={mdxPage.src}
            className={`block h-[calc(100vh-350px)] max-h-[calc(((100vw*9)/16))] min-h-[calc(((100vw*9)/16)*0.57)] w-full object-cover ${mdxPage.objectFit === 'cover' ? '' : 'p-[10px] sm:p-[50px]'}`}
            style={{ objectFit: mdxPage.objectFit }}
          />
        )}
        <div
          className={`pb-[100px] ${mdxPage.src ? 'pt-[50px] md:pt-[60px]' : 'pt-[100px] md:pt-[120px]'}`}
        >
          <article className="prose prose-base prose-stone mx-auto max-w-[70ch] px-4 lg:prose-lg dark:prose-invert sm:px-8">
            <Suspense>
              {tmp && <Island page={mdxPage} />}
              <Suspense fallback={<Fallback />}>
                <h1>{mdxPage.title}</h1>
                <Mdx components={mdxComponents} />
                <MediumZoom />
              </Suspense>
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
  img: (props) => <img {...props} className="asd" />,
};
