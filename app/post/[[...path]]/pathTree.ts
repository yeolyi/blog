import { readdir } from "fs/promises";
import { join } from "path";
import { PathNode, DirectoryNode } from "./PathNode";
import { mapAsync, isDirectory, notEmpty } from "./util";

export const preorderTraversePathTree = async (
  node: PathNode,
  f: (node: PathNode) => Promise<void>
) => {
  await f(node);
  node.type === "DIRECTORY" &&
    (await mapAsync(node.children, (node) =>
      preorderTraversePathTree(node, f)
    ));
};

export const buildPathTree = async (
  startDirectory: string
): Promise<DirectoryNode> => {
  const ret: DirectoryNode = {
    type: "DIRECTORY",
    segments: [],
    children: [],
  };
  ret.children = await makePathNode(startDirectory, ret.segments);
  return ret;
};

const makePathNode = async (
  curPath: string,
  prevSegments: string[]
): Promise<PathNode[]> => {
  const fileAndDirectoryNames = await readdir(curPath);

  const nameToNode = async (name: string): Promise<PathNode | null> => {
    if (isIgnoredPath(name)) {
      return null;
    }

    const namePath = join(curPath, name);
    const segments = [...prevSegments, name];

    if (await isDirectory(namePath)) {
      return {
        type: "DIRECTORY",
        segments,
        children: await makePathNode(namePath, segments),
      };
    } else {
      return {
        type: "FILE",
        segments,
      };
    }
  };

  return (await mapAsync(fileAndDirectoryNames, nameToNode)).filter(notEmpty);
};

const isIgnoredPath = (path: string) =>
  path === "node_modules" || path.startsWith(".");
