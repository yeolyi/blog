import "highlight.js/styles/github-dark.css";
import { Metadata } from "next";
import assemblePost from "./assemblePost";

interface PostProps {
  params: {
    path?: string[];
  };
}

export const generateMetadata = async ({
  params,
}: PostProps): Promise<Metadata> => {
  //   const { frontmatter } = await assemblePost(params.path ?? []);

  return {
    // title: frontmatter.title,
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

export default PostPage;
