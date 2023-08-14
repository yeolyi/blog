import rehypeStringify from "rehype-stringify";
import remarkFrontmatter from "remark-frontmatter";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import remarkParseFrontmatter from "remark-parse-frontmatter";

const Post = async ({ params }: { params: { path?: string[] } }) => {
  const data = await fetchPost();
  return <div dangerouslySetInnerHTML={{ __html: data.content }}></div>;
};

interface Data {
  frontmatter: {
    title: string;
  };
}

const fetchPost = async (path?: string[]) => {
  const resp = await fetch("http://43.200.204.95:3001/index.md");
  const text = await resp.text();
  const file = await unified()
    .use(remarkParse)
    .use(remarkFrontmatter, ["yaml"])
    .use(remarkParseFrontmatter)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(text);

  const data = file.data as unknown as Data;

  return {
    content: String(file),
    frontmatter: data.frontmatter,
  };
};

export default Post;
