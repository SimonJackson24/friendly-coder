import { FileNode } from '@/hooks/useFileSystem';

export function buildFileTree(files: FileNode[]): FileNode[] {
  const tree: FileNode[] = [];
  const map = new Map<string, FileNode>();

  // First pass: create all nodes
  files.forEach((file) => {
    const node: FileNode = {
      ...file,
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

  return sortFileTree(tree);
}

export function sortFileTree(tree: FileNode[]): FileNode[] {
  return tree.sort((a, b) => {
    // Folders come before files
    if (a.type === 'folder' && b.type === 'file') return -1;
    if (a.type === 'file' && b.type === 'folder') return 1;
    
    // Sort alphabetically within same type
    return a.name.localeCompare(b.name);
  }).map(node => {
    if (node.children) {
      return {
        ...node,
        children: sortFileTree(node.children)
      };
    }
    return node;
  });
}

export function findFileInTree(tree: FileNode[], id: string): FileNode | null {
  for (const node of tree) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findFileInTree(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

export function getFilePath(tree: FileNode[], id: string): string {
  const file = findFileInTree(tree, id);
  return file ? file.path : '';
}

export function validateFileName(name: string): boolean {
  // Check for invalid characters
  const invalidChars = /[<>:"\/\\|?*\x00-\x1F]/;
  if (invalidChars.test(name)) return false;
  
  // Check for reserved names (Windows)
  const reservedNames = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/i;
  if (reservedNames.test(name)) return false;
  
  return true;
}