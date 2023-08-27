import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import path from 'path';
import { DetailedHTMLProps, AnchorHTMLAttributes, HTMLAttributes } from 'react';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

export default function CustomMDXRemote({
  segments,
  source,
}: {
  segments: string[];
  source: string;
}) {
  return (
    <MDXRemote
      source={source}
      options={options}
      components={{
        h2: (props) => <CustomH2 {...props} />,
        a: (props) => (
          <CustomAnchor
            {...props}
            segments={segments}
          />
        ),
        code: (props) => (
          <code
            {...props}
            className="not-prose"
          />
        ),
      }}
    />
  );
}

const options: MDXRemoteProps['options'] = {
  mdxOptions: {
    format: 'md',
    remarkPlugins: [remarkGfm],
    rehypePlugins: [() => rehypeHighlight({ ignoreMissing: true })],
  },
};

const CustomH2 = (
  props: DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>,
) => (
  <h2
    {...props}
    id={(props.children + '').replace(/ /, '-')}
  />
);

const CustomAnchor = (
  props: DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> & {
    segments: string[];
  },
) => {
  if (props.href) {
    if (
      props.href.startsWith('http://') ||
      props.href.startsWith('https://') ||
      props.href.startsWith('/')
    ) {
      return (
        <a
          {...props}
          target="_blank"
        />
      );
    } else {
      return <Link href={absolute(props.segments, props.href)}>{props.children}</Link>;
    }
  } else {
    return <a {...props} />;
  }
};

const absolute = (segments: string[], href: string) => {
  if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('/')) {
    return href;
  }

  return path.join('/docs', ...segments, href);
};
