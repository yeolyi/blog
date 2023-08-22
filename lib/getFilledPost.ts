import { readFile } from "fs/promises";
import matter from "gray-matter";
import path from "path";
import getSrcPath from "./getSrcPath";
import replaceCodeDirectives from "./replaceCodeDirectives";

interface PostCache {
  data: { title?: string; description?: string };
  content: string;
}

const cache: { [key: string]: PostCache } = {};

type PostPath =
  | { type: "SEGMENTS"; segments?: string[] }
  | {
      type: "PATH";
      path: string;
    };

export default async function getFilledPost(postPath: PostPath) {
  const mdPath = getmdPath(postPath);

  if (process.env.NODE_ENV === "development" && mdPath in cache) {
    return cache[mdPath];
  }

  const md = await readFile(mdPath, { encoding: "utf-8" });
  const { data, content } = matter(md);

  const replacedMD = await replaceCodeDirectives(content, mdPath);

  return (cache[mdPath] = { data, content: replacedMD });
}

const getmdPath = (postPath: PostPath) => {
  if (postPath.type === "PATH") {
    return path.join(getSrcPath(), postPath.path);
  } else {
    return path.join(getSrcPath(), ...(postPath.segments ?? []), "index.md");
  }
};
