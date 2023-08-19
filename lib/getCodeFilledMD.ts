import { readFile } from "fs/promises";
import path from "path";
import BASE_URL from "./baseURL";
import replaceCodeDirectives from "./replaceCodeDirectives";
import getMDFromCache, { saveMDToCache } from "./mdCache";

const getCodeFilledMD = async (segments: string[]) => {
  const cacheResult = await getMDFromCache(segments);
  if (cacheResult) {
    console.log("Using cache...");
    return cacheResult;
  } else {
    console.log("Making md...");
    const md = await getIndexMD(segments);
    saveMDToCache(segments, md);
    return getCodeDirectivesReplacedMD(segments, md);
  }
};

const getIndexMD = (segments: string[]) =>
  readFile(getMDPath(segments), {
    encoding: "utf-8",
  });

const getCodeDirectivesReplacedMD = (segments: string[], md: string) => {
  const postPath = segments.join("/");
  return replaceCodeDirectives(md, postPath);
};

export const getMDPath = (segments: string[]) =>
  path.join(BASE_URL, ...segments, "index.md");

export default getCodeFilledMD;
