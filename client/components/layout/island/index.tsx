import {
  ultraPath,
  defaultPath,
  ultraSvgSize,
  defaultSVGSize,
  ultraBorderPath,
  defaultBorderPath,
  ultraBorderSize,
  defaultBorderSize,
} from '@/client/components/layout/island/path';
import useCurrentHeading from '@/client/components/layout/island/useCurrentHeading';
import { LazyMotion, m } from 'framer-motion';
import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { RiHome2Line } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';

// https://developer.apple.com/design/human-interface-guidelines/live-activities
// https://www.behance.net/gallery/153642485/Dynamic-Island-Reference-Dimensions

const loadFeatures = () => import('./lazy.ts').then((res) => res.default);

export default function Island() {
  const [hover, setHover] = useState(false);
  const { headingList, currentHeading } = useCurrentHeading();
  const borderSize = hover ? ultraBorderSize : defaultBorderSize;
  const size = hover ? ultraSvgSize : defaultSVGSize;
  const isTouch = window.matchMedia('(any-hover: none)').matches;
  const navigate = useNavigate();

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isTouch) return;

    const handleClickOutside = (event: Event) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        if (isTouch) setHover(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('scroll', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('scroll', handleClickOutside);
    };
  }, [isTouch]);

  useLayoutEffect(() => {
    // TODO: 정리좀...
    if (currentHeading && ref.current) {
      const idx = headingList.indexOf(currentHeading) ?? 0;
      const tmp = headingList
        .slice(0, idx)
        .reduce((acc, cur) => acc + cur.offsetHeight, 0);
      ref.current.scrollTop = tmp + (idx - 1) * 4 - 100;
    }
  }, [hover]);

  return (
    <LazyMotion features={loadFeatures}>
      <m.div
        className="fixed bottom-6 z-50 cursor-pointer rounded-full border border-[#3C3C3C] bg-black sm:bottom-auto sm:top-6"
        style={{
          left: `calc(50vw + ${defaultSVGSize.width / 2 + 5}px)`,
          width: defaultSVGSize.height,
          height: defaultSVGSize.height,
        }}
        animate={{ translateX: hover ? '40px' : 0 }}
        onClick={() => navigate('/')}
      >
        <RiHome2Line className="h-full w-full p-2" />
      </m.div>
      <m.div
        className="not-prose fixed bottom-6 left-1/2 z-40 -translate-x-1/2 translate-y-[1px] bg-[#3C3C3C] sm:bottom-auto sm:top-6 sm:translate-y-[-1px]"
        animate={{
          ...borderSize,
          clipPath: `path('${hover ? ultraBorderPath : defaultBorderPath}')`,
          transition: {
            type: 'spring',
            stiffness: 400,
            damping: 30,
          },
        }}
        initial={false}
      />
      <m.div
        className="not-prose no-scrollbar fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 flex-col gap-1 overflow-x-clip overflow-y-scroll bg-black px-2 sm:bottom-auto sm:top-6"
        animate={{
          ...size,
          clipPath: `path('${hover ? ultraPath : defaultPath}')`,
          paddingTop: hover ? '10px' : 0,
          paddingBottom: hover ? '10px' : 0,
          transition: {
            type: 'spring',
            stiffness: 400,
            damping: 30,
          },
        }}
        onHoverStart={() => setHover(true)}
        onHoverEnd={() => setHover(false)}
        onClick={() => isTouch && setHover(true)}
        initial={false}
        ref={ref}
      >
        {headingList.map((heading, idx) => {
          const visible = hover || heading === currentHeading;
          if (!visible) return;

          const isH2 = heading.tagName === 'H2';
          const content = heading.textContent;

          const prevH2Heading =
            isH2 ? undefined : (
              headingList.slice(0, idx).findLast((x) => x.tagName === 'H2')
            );

          return (
            <m.button
              key={idx}
              onClick={() => {
                if (!hover) return;
                heading.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              <m.p
                className="text-ellipsis text-nowrap"
                style={{
                  lineHeight: hover ? undefined : defaultSVGSize.height + 'px',
                }}
              >
                {isH2 ?
                  <H2Label layoutId={idx + ''}>{content}</H2Label>
                : <>
                    {!hover ?
                      <H2Label
                        layoutId={headingList.indexOf(prevH2Heading!) + ''}
                      >
                        {prevH2Heading?.textContent}
                      </H2Label>
                    : null}
                    {'  '}
                    <H3Label layoutId={idx + ''}>{content}</H3Label>
                  </>
                }
              </m.p>
            </m.button>
          );
        })}
      </m.div>
    </LazyMotion>
  );
}

const H2Label = ({
  layoutId,
  children,
}: {
  layoutId?: string;
  children: ReactNode;
}) => {
  return (
    <m.span
      className="inline-block text-center text-base font-bold text-neutral-200"
      layoutId={layoutId}
      transition={{ type: 'tween', duration: 0.25 }}
    >
      {children}
    </m.span>
  );
};

const H3Label = ({
  layoutId,
  children,
}: {
  layoutId: string;
  children: ReactNode;
}) => (
  <m.span
    className="inline-block text-center text-sm font-semibold text-neutral-400"
    layoutId={layoutId}
    transition={{ type: 'tween', duration: 0.25 }}
  >
    {children}
  </m.span>
);
