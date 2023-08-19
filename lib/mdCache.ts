import { mkdir, readFile, stat, writeFile } from "fs/promises";
import path from "path";
import { cwd } from "process";

const getMDFromCache = async (
  segments: string[]
): Promise<string | undefined> => {
  const cachePath = segmentToCachePath(segments);
  try {
    return await readFile(cachePath, { encoding: "utf-8" });
  } catch (e) {
    return undefined;
  }
};

export const saveMDToCache = async (segments: string[], content: string) => {
  const cachePath = segmentToCachePath(segments);
  try {
    await writeFile(cachePath, content, { flag: "wx" });
  } catch {
    await mkdir(path.join(cwd(), ".cache/"));
    await writeFile(cachePath, content, { flag: "wx" });
  }
};

// cwd ㄱㅊ?
const segmentToCachePath = (segments: string[]) =>
  path.join(cwd(), ".cache/", segmentToKey(segments) + ".md");

// https://stackoverflow.com/questions/9847288/is-it-possible-to-use-in-a-filename
// 따라서 join한게 겹칠 수 없다.
const segmentToKey = (segments: string[]) => cyrb53(segments.join("/"));

// https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
const cyrb53 = (str: string, seed = 0) => {
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

export default getMDFromCache;
