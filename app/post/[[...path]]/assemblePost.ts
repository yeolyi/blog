import { readFile } from "fs/promises";
import path from "path";
import replaceCodeDirectives from "../../../lib/replaceCodeDirectives";
import getSrcPath from "@/lib/getSrcPath";
import matter from "gray-matter";

const cache: { [key: string]: any } = {};

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

export default assemblePost;
