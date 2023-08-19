import "highlight.js/styles/github-dark.css";
import { Metadata } from "next";
import assemblePost from "./assemblePost";
import { buildPathTree, preorderTraversePathTree } from "./pathTree";
import BASE_URL from "@/lib/baseURL";

interface PostProps {
  params: {
    path?: string[];
  };
}

export const generateMetadata = async ({
  params,
}: PostProps): Promise<Metadata> => {
  const { frontmatter } = await assemblePost(params.path ?? []);

  return {
    title: frontmatter.title,
  };
};

const PostPage = async ({ params }: PostProps) => {
  const { content, frontmatter } = await assemblePost(params.path ?? []);
  return (
    <>
      <h2>{frontmatter.title}</h2>
      <hr />
      {content}
    </>
  );
};

export const generateStaticParams = async () => {
  const root = await buildPathTree(BASE_URL);
  const fileTree: string[][] = [];
  await preorderTraversePathTree(root, async (x) => {
    if (
      x.type === "FILE" &&
      x.segments[x.segments.length - 1].endsWith("index.md")
    )
      fileTree.push(x.segments.slice(0, -1));
  });
  return fileTree.map((path) => ({ path }));
};

export default PostPage;
