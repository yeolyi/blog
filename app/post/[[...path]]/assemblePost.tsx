import { readFile } from "fs/promises";
import { MDXRemoteProps, compileMDX } from "next-mdx-remote/rsc";
import Link from "next/link";
import path from "path";
import rehypeHighlight from "rehype-highlight";
import replaceCodeDirectives from "../../../lib/replaceCodeDirectives";
import getSrcPath from "@/lib/getSrcPath";

const cache: { [key: string]: any } = {};

const assemblePost = async (segments: string[]) => {
  const mdPath = path.join(getSrcPath(), ...segments, "index.md");

  if (mdPath in cache) {
    console.log("using cache");
    return cache[mdPath];
  }

  const md = await readFile(mdPath, { encoding: "utf-8" });
  const replacedMD = await replaceCodeDirectives(md, mdPath);
  const comp = convertMDtoComponent(segments, replacedMD);

  cache[mdPath] = comp;
  return comp;
};

const convertMDtoComponent = (segments: string[], md: string) => {
  const options: MDXRemoteProps["options"] = {
    parseFrontmatter: true,
    mdxOptions: {
      format: "md",
      rehypePlugins: [() => rehypeHighlight({ ignoreMissing: true })],
    },
  };

  return compileMDX({
    source: md,
    options,
    components: {
      a: (props) => (
        <Link href={absolute(segments, props.href ?? "")}>
          {props.children}
        </Link>
      ),
      code: (props) => <code {...props} className="not-prose" />,
    },
  });
};

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

export default assemblePost;
