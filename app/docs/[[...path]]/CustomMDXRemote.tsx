import { MDXRemote, MDXRemoteProps } from "next-mdx-remote/rsc";
import Link from "next/link";
import path from "path";
import { DetailedHTMLProps, AnchorHTMLAttributes } from "react";
import rehypeHighlight from "rehype-highlight";

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
        a: (props) => <CustomAnchor {...props} segments={segments} />,
        code: (props) => <code {...props} className="not-prose" />,
      }}
    />
  );
}

const options: MDXRemoteProps["options"] = {
  mdxOptions: {
    format: "md",
    rehypePlugins: [() => rehypeHighlight({ ignoreMissing: true })],
  },
};

const CustomAnchor = (
  props: DetailedHTMLProps<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  > & { segments: string[] }
) => {
  if (props.href) {
    if (
      props.href.startsWith("http://") ||
      props.href.startsWith("https://") ||
      props.href.startsWith("/")
    ) {
      return <a {...props} />;
    } else {
      return (
        <Link href={absolute(props.segments, props.href)}>
          {props.children}
        </Link>
      );
    }
  } else {
    return <a {...props} />;
  }
};

const absolute = (segments: string[], href: string) => {
  if (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("/")
  ) {
    return href;
  }

  return path.join("/docs", ...segments, href);
};
