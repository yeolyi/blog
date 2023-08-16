import { compileMDX } from "next-mdx-remote/rsc";
import Link from "next/link";
import { BASE_URL, replaceCodeDirectives } from "./codeReplacer";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import path from "path";
import { readFile } from "fs/promises";

const Post = async ({ params }: { params: { path?: string[] } }) => {
  const { content, frontmatter } = await fetchPost(params.path ?? []);
  return (
    <>
      <h2>{frontmatter.title}</h2>
      <hr />
      {content}
    </>
  );
};

// export const generateStaticParams = async () => {
//   const resp = await fetch(BASE_URL + "markdownPaths.json");
//   const x: string[][] = await resp.json();
//   return x.map((path) => ({ path }));
// };

const fetchPost = async (segments: string[]) => {
  const postPath = segments.join("/") + "/";

  const raw = await readFile(path.join(BASE_URL, postPath, "index.md"), {
    encoding: "utf-8",
  });
  const source = await replaceCodeDirectives(raw, postPath);
  return await compileMDX<{ title: string }>({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        format: "md",
        rehypePlugins: [() => rehypeHighlight({ ignoreMissing: true })],
      },
    },
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

function absolute(segments: string[], href: string) {
  if (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("/")
  ) {
    return href;
  }

  return path.join("/post", ...segments, href);
}

export default Post;
