export type PathNode = FileNode | DirectoryNode;

export type FileNode = {
  type: "FILE";
  segments: string[];
};

export type DirectoryNode = {
  type: "DIRECTORY";
  segments: string[];
  children: PathNode[];
};
