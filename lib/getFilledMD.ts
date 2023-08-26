import { readFile } from "fs/promises";
import path from "path";
import getSrcPath from "./getSrcPath";
import replaceCodeDirectives from "./replaceCodeDirectives";
import extractFrontMatter from "./extractFrontMatter";
import extractTOC from "./extractTOC";
import { PostCache, cache } from "./postCache";

type PostPath =
  | { type: "SEGMENTS"; segments?: string[] }
  | {
      type: "PATH";
      path: string;
    };

export default async function getFilledMD(
  postPath: PostPath
): Promise<PostCache> {
  const mdPath = getmdPath(postPath);

  if (isProduction && mdPath in cache) {
    return cache[mdPath];
  }

  const md = await readFile(mdPath, { encoding: "utf-8" });
  const { data, content } = extractFrontMatter(md);
  const toc = extractTOC(content);
  const replacedMD = await replaceCodeDirectives(content, mdPath);

  return (cache[mdPath] = { data, content: replacedMD, toc });
}

const getmdPath = (postPath: PostPath) => {
  if (postPath.type === "PATH") {
    return path.join(getSrcPath(), postPath.path);
  } else {
    return path.join(getSrcPath(), ...(postPath.segments ?? []), "index.md");
  }
};

const isProduction = process.env.NODE_ENV === "production";
