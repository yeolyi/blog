import { lstat, readdir } from "fs/promises";
import path from "path";

export default async function iteratePath(
  curPath: string,
  segments: string[],
  f: (filePath: string, segments: string[]) => void,
  skipFolder: (folderName: string) => boolean
) {
  const names = await readdir(curPath);
  const promises = names.map(async (name) => {
    const nextPath = path.join(curPath, name);
    const nextSegments = [...segments, name];

    if (await isDirectory(nextPath)) {
      if (skipFolder(name)) return;
      await iteratePath(nextPath, nextSegments, f, skipFolder);
    } else {
      f(nextPath, segments);
    }
  });
  await Promise.all(promises);
}

const isDirectory = async (path: string) => {
  const stat = await lstat(path);
  return stat.isDirectory();
};
