'use server';

import { DetailedHTMLProps, AnchorHTMLAttributes, Suspense } from 'react';
import { JSDOM } from 'jsdom';
import { getErrorMessage } from '@/util/error';
import { HiGlobeAsiaAustralia } from 'react-icons/hi2';

type Props = DetailedHTMLProps<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>;

export default async function PreviewAnchor(props: Props) {
  return (
    <Suspense fallback={<Fallback {...props} />}>
      <Content {...props} />
    </Suspense>
  );
}

// https://medium.com/@ehdrbdndns/react-react%EC%97%90%EC%84%9C-link-preview-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0-cdfb31f154fe
const Content = async (props: Props) => {
  if (props.href === undefined) return <Fallback {...props} />;
  if (props.href.startsWith('http') === false) return <Fallback {...props} />;

  const { title, description } = await fetchMetadata(props.href);

  return (
    <a
      className="not-prose flex flex-col border-l-[3px] border-[#e2e8f0] px-3 py-2 not-italic hover:bg-neutral-50"
      href={props.href}
    >
      <span className="line-clamp-1 text-base font-semibold">
        <HiGlobeAsiaAustralia className="mr-[2px] inline -translate-y-[1.6px]" />
        {title}
      </span>
      {description !== null && (
        <span className="line-clamp-1 text-sm">{description}</span>
      )}
    </a>
  );
};

const fetchMetadata = async (href: string) => {
  try {
    const resp = await fetch(href);
    const data = await resp.text();

    // CSS 제거 workaround
    // https://github.com/jsdom/jsdom/issues/2005#issuecomment-1758940894
    const dom = new JSDOM(
      data
        .replace(/<style([\S\s]*?)>([\S\s]*?)<\/style>/gim, '')
        ?.replace(/<script([\S\s]*?)>([\S\s]*?)<\/script>/gim, ''),
    );
    const document = dom.window.document;

    const ogtitle = document
      .querySelector('meta[property="og:title"]')
      ?.getAttribute('content');
    const title = ogtitle ?? document.title;

    const description =
      document
        .querySelector('meta[property="og:description"]')
        ?.getAttribute('content') ??
      document
        .querySelector('meta[name="description"]')
        ?.getAttribute('content') ??
      null;

    return { title, description };
  } catch (e) {
    return { title: getErrorMessage(e) };
  }
};

const Fallback = (props: Props) => <a {...props} />;
