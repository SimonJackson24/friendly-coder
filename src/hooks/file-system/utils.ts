import { FileNode } from "../useFileSystem";

export function buildFileTree(files: any[]): FileNode[] {
  const tree: FileNode[] = [];
  const map = new Map<string, FileNode>();

  // First pass: create all nodes
  files.forEach((file) => {
    const node: FileNode = {
      id: file.id,
      name: file.name,
      type: file.type,
      path: file.path,
      content: file.content,
      children: [],
    };
    map.set(file.path, node);

    // If it's a root level item, add it to the tree
    if (!file.path.includes("/")) {
      tree.push(node);
    }
  });

  // Second pass: build relationships
  files.forEach((file) => {
    if (file.path.includes("/")) {
      const parentPath = file.path.substring(0, file.path.lastIndexOf("/"));
      const parent = map.get(parentPath);
      const node = map.get(file.path);
      if (parent && node) {
        parent.children?.push(node);
      }
    }
  });

  return tree;
}