import { compileMDX } from "next-mdx-remote/rsc";
import Link from "next/link";
import { BASE_URL, replaceCodeDirectives } from "./codeReplacer";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import path from "path";

const Post = async ({ params }: { params: { path?: string[] } }) => {
  const { content, frontmatter } = await fetchPost(params.path);
  return (
    <>
      <h2>{frontmatter.title}</h2>
      <hr />
      {content}
    </>
  );
};

export const generateStaticParams = async () => {
  const resp = await fetch(BASE_URL + "markdownPaths.json");
  const x: string[][] = await resp.json();
  return x.map((path) => ({ path }));
};

const fetchPost = async (segments?: string[]) => {
  segments ||= [];
  const postPath = segments.join("/") + "/";

  const resp = await fetch(BASE_URL + postPath + "index.md");
  const raw = await resp.text();
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
        <Link href={absolute(props.href ?? "")}>{props.children}</Link>
      ),
      code: (props) => <code {...props} className="not-prose" />,
    },
  });
};

function absolute(href: string) {
  if (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("/")
  ) {
    return href;
  }

  return path.join("post", href);
}

export default Post;
