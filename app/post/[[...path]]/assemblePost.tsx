import { readFile } from "fs/promises";
import { MDXRemoteProps, compileMDX } from "next-mdx-remote/rsc";
import Link from "next/link";
import path from "path";
import rehypeHighlight from "rehype-highlight";
import replaceCodeDirectives from "../../../lib/replaceCodeDirectives";
import BASE_URL from "@/lib/baseURL";
import { cwd } from "process";

const assemblePost = async (segments: string[]) => {
  const md = await getIndexMD(segments);
  const replacedMD = await getCodeDirectivesReplacedMD(segments, md);
  return convertMDtoComponent(segments, replacedMD);
};

const getIndexMD = (segments: string[]) =>
  readFile(path.join(cwd(), BASE_URL, ...segments, "index.md"), {
    encoding: "utf-8",
  });

const getCodeDirectivesReplacedMD = (segments: string[], md: string) => {
  const postPath = segments.join("/");
  return replaceCodeDirectives(md, postPath);
};

interface FrontmatterType {
  title?: string;
}

const convertMDtoComponent = (segments: string[], md: string) => {
  const options: MDXRemoteProps["options"] = {
    parseFrontmatter: true,
    mdxOptions: {
      format: "md",
      rehypePlugins: [() => rehypeHighlight({ ignoreMissing: true })],
    },
  };

  return compileMDX<FrontmatterType>({
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
