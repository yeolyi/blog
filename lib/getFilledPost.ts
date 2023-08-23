import { readFile } from "fs/promises";
import path from "path";
import getSrcPath from "./getSrcPath";
import replaceCodeDirectives from "./replaceCodeDirectives";
import getFrontMatter from "./getFrontMatter";

interface TOC {
  h2: {
    name: string;
    h3: string[];
  }[];
}

interface PostCache {
  data: { title?: string; description?: string };
  content: string;
  toc: TOC;
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
  const { data, content } = getFrontMatter(md);
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

const extractTOC = (content: string): TOC => {
  const h2Reg = /^## (.+)/gm;
  let m: RegExpExecArray | null;
  const h2 = [];
  do {
    m = h2Reg.exec(content);
    if (m) h2.push(m[1]);
  } while (m);

  return {
    h2: h2.map((x) => ({ name: x, h3: [] })),
  };
};
