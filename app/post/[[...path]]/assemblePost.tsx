import { readFile } from "fs/promises";
import { MDXRemoteProps, compileMDX } from "next-mdx-remote/rsc";
import Link from "next/link";
import path from "path";
import rehypeHighlight from "rehype-highlight";
import replaceCodeDirectives from "../../../lib/replaceCodeDirectives";
import BASE_URL from "@/lib/baseURL";
import getCodeFilledMD from "@/lib/getCodeFilledMD";

const assemblePost = async (segments: string[]) => {
  const md = await getCodeFilledMD(segments);
//   console.log("LOADING", segments);
//   await new Promise((resolve) => setTimeout(resolve, 2000));
//   console.log("end");
  return convertMDtoComponent(segments, md);
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
