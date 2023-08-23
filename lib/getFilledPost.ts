import { readFile } from "fs/promises";
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

export default async function getFilledPost(
  postPath: PostPath
): Promise<PostCache> {
  const mdPath = getmdPath(postPath);

  if (process.env.NODE_ENV === "production" && mdPath in cache) {
    return cache[mdPath];
  }

  const md = await readFile(mdPath, { encoding: "utf-8" });
  const { data, content } = extractFrontMatter(md);

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

const extractFrontMatter = (content: string) => {
  const reg = /---\s*((?:.|\n)*?)---((?:.|\n)*)/;
  const match = content.match(reg);
  if (match === null) {
    return { data: {}, content };
  } else {
    const data = match[1]
      .split("\n")
      .reduce<{ [key: string]: string }>((acc, cur) => {
        if (!cur.includes(":")) return acc;
        const [key, value] = cur.split(":");
        acc[key.trim()] = value.trim();
        return acc;
      }, {});
    return {
      data,
      content: match[2],
    };
  }
};
