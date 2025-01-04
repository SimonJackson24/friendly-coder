import semver from 'https://esm.sh/semver@7.5.4';

export interface DependencyNode {
  name: string;
  version: string;
  dependencies: Record<string, string>;
  resolved?: boolean;
  circular?: boolean;
}

export async function resolveDependencyTree(
  dependencies: Record<string, string>,
  supabase: any,
  visited = new Set<string>()
): Promise<Record<string, DependencyNode>> {
  const tree: Record<string, DependencyNode> = {};
  
  for (const [name, versionRange] of Object.entries(dependencies)) {
    console.log(`Resolving dependency: ${name}@${versionRange}`);
    
    // Check for circular dependencies
    const depKey = `${name}@${versionRange}`;
    if (visited.has(depKey)) {
      console.log(`Circular dependency detected: ${depKey}`);
      tree[name] = {
        name,
        version: versionRange,
        dependencies: {},
        circular: true
      };
      continue;
    }
    
    visited.add(depKey);

    // Get all versions of this package
    const { data: versions } = await supabase
      .from('package_versions')
      .select('version, dependency_tree')
      .eq('name', name)
      .order('created_at', { ascending: false });

    if (!versions?.length) {
      console.log(`No versions found for ${name}`);
      tree[name] = {
        name,
        version: versionRange,
        dependencies: {},
        resolved: false
      };
      continue;
    }

    // Find best matching version
    const availableVersions = versions.map(v => v.version);
    const matchingVersion = semver.maxSatisfying(availableVersions, versionRange);

    if (!matchingVersion) {
      console.log(`No matching version found for ${name}@${versionRange}`);
      tree[name] = {
        name,
        version: versionRange,
        dependencies: {},
        resolved: false
      };
      continue;
    }

    // Get dependencies of matched version
    const matchedVersion = versions.find(v => v.version === matchingVersion);
    const subDependencies = matchedVersion?.dependency_tree || {};

    // Recursively resolve sub-dependencies
    const resolvedSubDeps = await resolveDependencyTree(subDependencies, supabase, new Set(visited));

    tree[name] = {
      name,
      version: matchingVersion,
      dependencies: resolvedSubDeps,
      resolved: true
    };
  }

  return tree;
}

export function validateDependencyTree(
  tree: Record<string, DependencyNode>
): { isValid: boolean; conflicts: string[] } {
  const conflicts: string[] = [];
  const versionMap = new Map<string, Set<string>>();

  function traverse(node: DependencyNode) {
    // Track versions for each package
    if (!versionMap.has(node.name)) {
      versionMap.set(node.name, new Set());
    }
    versionMap.get(node.name)!.add(node.version);

    // Check sub-dependencies
    Object.values(node.dependencies).forEach(traverse);
  }

  // Build version map
  Object.values(tree).forEach(traverse);

  // Check for version conflicts
  for (const [name, versions] of versionMap.entries()) {
    if (versions.size > 1) {
      conflicts.push(
        `Package ${name} has multiple versions: ${Array.from(versions).join(', ')}`
      );
    }
  }

  return {
    isValid: conflicts.length === 0,
    conflicts
  };
}