import { DetailedHTMLProps, AnchorHTMLAttributes, Suspense } from 'react';
import { JSDOM } from 'jsdom';

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

  const resp = await fetch(props.href);
  const data = await resp.text();
  const dom = new JSDOM(data);
  const document = dom.window.document;
  const title = document.title;
  const description =
    document
      .querySelector('meta[property="og:description"]')
      ?.getAttribute('content') ?? null;

  const url = new URL(props.href);

  return (
    <a
      className="not-prose flex flex-col gap-1 border border-neutral-200 p-3 hover:bg-neutral-50"
      href={props.href}
    >
      <span className="text-sm text-neutral-600 underline">{url.hostname}</span>
      <p className="line-clamp-1 text-base font-semibold">{title}</p>
      {description !== null && (
        <p className="line-clamp-1 text-sm">{description}</p>
      )}
    </a>
  );
};

const Fallback = (props: Props) => <a {...props} />;
