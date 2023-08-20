import { MDXRemote, MDXRemoteProps } from "next-mdx-remote/rsc";
import Link from "next/link";
import path from "path";
import rehypeHighlight from "rehype-highlight";

export default function CustomMDXRemote({
  segments,
  source,
}: {
  segments: string[];
  source: string;
}) {
  const options: MDXRemoteProps["options"] = {
    mdxOptions: {
      format: "md",
      rehypePlugins: [() => rehypeHighlight({ ignoreMissing: true })],
    },
  };

  return (
    <MDXRemote
      source={source}
      options={options}
      components={{
        a: (props) => (
          <Link href={absolute(segments, props.href ?? "")}>
            {props.children}
          </Link>
        ),
        code: (props) => <code {...props} className="not-prose" />,
      }}
    />
  );
}

const absolute = (segments: string[], href: string) => {
  if (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("/")
  ) {
    return href;
  }

  return path.join("/post", ...segments, href);
};
