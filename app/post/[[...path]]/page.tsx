import "highlight.js/styles/github-dark.css";
import { Metadata } from "next";
import assemblePost from "./assemblePost";
import { readdir } from "fs/promises";
import { isDirectory } from "./util";
import path from "path";
import { cwd } from "process";

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
  console.info("generating static params...");
  const params: { path: string[] }[] = [];
  const srcPath = process.env.SRC_PATH;
  if (srcPath === undefined) {
    throw new Error("SRC_PATH 환경변수가 없습니다.");
  }
  await iteratePath(path.join(cwd(), srcPath), [], (filePath, segments) => {
    if (filePath.endsWith("/index.md")) {
      params.push({ path: segments });
    }
  });

  return params;
};

const iteratePath = async (
  curPath: string,
  segments: string[],
  f: (filePath: string, segments: string[]) => void
) => {
  const names = await readdir(curPath);
  const promises = names.map(async (name) => {
    const nextPath = path.join(curPath, name);
    const nextSegments = [...segments, name];

    if (await isDirectory(nextPath)) {
      if (isIgnoredPath(name)) return;
      await iteratePath(nextPath, nextSegments, f);
    } else {
      f(nextPath, segments);
    }
  });
  await Promise.all(promises);
};

const isIgnoredPath = (path: string) =>
  path === "node_modules" || path.startsWith(".");

export default PostPage;
