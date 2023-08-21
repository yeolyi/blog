import "highlight.js/styles/github-dark.css";
import { Metadata } from "next";
import getSrcPath from "@/lib/getSrcPath";
import iteratePath from "@/lib/iteratePath";
import CustomMDXRemote from "./CustomMDXRemote";
import replaceCodeDirectives from "@/lib/replaceCodeDirectives";
import { readFile } from "fs/promises";
import matter from "gray-matter";
import path from "path";

interface PostProps {
  params: {
    path?: string[];
  };
}

export const generateMetadata = async ({
  params,
}: PostProps): Promise<Metadata> => {
  const { data, content } = await assemblePost(params.path ?? []);
  return {
    title: data.title,
    description: content.slice(150),
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

interface PostCache {
  data: { title?: string };
  content: string;
}

const cache: { [key: string]: PostCache } = {};

const assemblePost = async (segments: string[]) => {
  const mdPath = path.join(getSrcPath(), ...segments, "index.md");

  if (mdPath in cache) {
    return cache[mdPath];
  }

  const md = await readFile(mdPath, { encoding: "utf-8" });
  const { data, content } = matter(md);

  const replacedMD = await replaceCodeDirectives(content, mdPath);

  return (cache[mdPath] = { data, content: replacedMD });
};

export default PostPage;
