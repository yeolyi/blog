import "highlight.js/styles/github-dark.css";
import { Metadata } from "next";
import assemblePost from "./assemblePost";
import getSrcPath from "@/lib/getSrcPath";
import iteratePath from "@/lib/iteratePath";
import CustomMDXRemote from "./CustomMDXRemote";

interface PostProps {
  params: {
    path?: string[];
  };
}

export const generateMetadata = async ({
  params,
}: PostProps): Promise<Metadata> => {
  const { data } = await assemblePost(params.path ?? []);
  return {
    title: data.title,
  };
};

const PostPage = async ({ params }: PostProps) => {
  const { data, content } = await assemblePost(params.path ?? []);
  return (
    <>
      <h2>{data?.title}</h2>
      <hr />
      <CustomMDXRemote segments={params.path ?? []} source={content} />
    </>
  );
};

export const generateStaticParams = async () => {
  const params: { path: string[] }[] = [];
  const srcPath = getSrcPath();
  const skipFolder = (path: string) =>
    path === "node_modules" || path.startsWith(".");
  const f = (filePath: string, segments: string[]) => {
    if (filePath.endsWith("/index.md")) {
      params.push({ path: segments });
    }
  };
  await iteratePath(srcPath, [], f, skipFolder);

  return params;
};

export default PostPage;
