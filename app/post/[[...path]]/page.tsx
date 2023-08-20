import "highlight.js/styles/github-dark.css";
import { Metadata } from "next";
import assemblePost from "./assemblePost";
import { lstat, readdir } from "fs/promises";
import path from "path";
import { cwd } from "process";
import getSrcPath from "@/lib/getSrcPath";

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
  const params: { path: string[] }[] = [];
  const srcPath = getSrcPath();
  await iteratePath(srcPath, [], (filePath, segments) => {
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

const isDirectory = async (path: string) => {
  const stat = await lstat(path);
  return stat.isDirectory();
};

export default PostPage;
