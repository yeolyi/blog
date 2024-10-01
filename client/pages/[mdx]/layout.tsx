import CodeBlock from '@/client/components/code';
import Giscus from '@/client/components/common/Giscus';
import mediumZoom from '@/client/components/image/medium-zoom';
import Footer from '@/client/components/layout/Footer';
import Island from '@/client/components/layout/island';
import { Fallback } from '@/client/pages/[mdx]/Fallback';
import { MdxPage } from '@/client/types/page';
import { MDXComponents } from 'mdx/types';
import { lazy, Suspense, useEffect } from 'react';
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
  // https://gist.github.com/gaearon/e7d97cdf38a2907924ea12e4ebdf3c85
  // TODO: useLayoutEffect를 사용할 방법?
  useEffect(() => {
    scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    let clear = () => {};
    let done = false;

    setTimeout(() => {
      if (done) return;
      const imgList = [
        ...document.querySelectorAll('article img'),
      ] as HTMLImageElement[];
      clear = mediumZoom(imgList);
    }, 1000);

    return () => {
      done = true;
      clear();
    };
  }, []);

  return (
    <>
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
            <Island />
            <Suspense fallback={<Fallback />}>
              <h1 className="font-semibold">{mdxPage.title}</h1>
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
  img: (props) => <img {...props} className="asd" />,
};
