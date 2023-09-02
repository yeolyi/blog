import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import path from 'path';
import { DetailedHTMLProps, AnchorHTMLAttributes, HTMLAttributes } from 'react';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import './github-dark.css';

export default function CustomMDXRemote({
  segments,
  source,
}: {
  segments?: string[];
  source: string;
}) {
  return (
    <div className="prose prose-invert prose-base mx-auto">
      <MDXRemote
        source={source}
        options={options}
        components={{
          h2: (props) => <CustomH2 {...props} />,
          a: (props) => (
            <CustomAnchor
              {...props}
              segments={segments ?? []}
            />
          ),
          pre: (props) => (
            <pre
              {...props}
              className="font-firacode rounded-none border border-white shadow-[8px_8px_0px_-4px_white] no-scrollbar p-6"
            />
          ),
        }}
      />
    </div>
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
