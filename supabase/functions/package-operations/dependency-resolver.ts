import semver from 'https://esm.sh/semver@7.5.4';

export interface DependencyNode {
  name: string;
  version: string;
  dependencies: Record<string, string>;
  resolved?: boolean;
  circular?: boolean;
  conflicts?: ConflictInfo[];
  suggestedVersion?: string;
}

interface ConflictInfo {
  dependencyName: string;
  currentVersion: string;
  requiredVersion: string;
  requiredBy: string[];
  suggestedVersion?: string;
}

export async function resolveDependencyTree(
  dependencies: Record<string, string>,
  supabase: any,
  visited = new Set<string>(),
  path: string[] = []
): Promise<Record<string, DependencyNode>> {
  const tree: Record<string, DependencyNode> = {};
  
  for (const [name, versionRange] of Object.entries(dependencies)) {
    console.log(`Resolving dependency: ${name}@${versionRange}`);
    
    // Check for circular dependencies with path tracking
    const depKey = `${name}@${versionRange}`;
    if (visited.has(depKey)) {
      console.log(`Circular dependency detected: ${path.join(' -> ')} -> ${depKey}`);
      tree[name] = {
        name,
        version: versionRange,
        dependencies: {},
        circular: true,
        conflicts: [{
          dependencyName: name,
          currentVersion: versionRange,
          requiredVersion: versionRange,
          requiredBy: [...path]
        }]
      };
      continue;
    }
    
    visited.add(depKey);
    path.push(depKey);

    // Get all versions of this package
    const { data: versions } = await supabase
      .from('package_versions')
      .select('version, dependency_tree, conflict_status')
      .eq('name', name)
      .order('created_at', { ascending: false });

    if (!versions?.length) {
      console.log(`No versions found for ${name}`);
      tree[name] = {
        name,
        version: versionRange,
        dependencies: {},
        resolved: false,
        conflicts: [{
          dependencyName: name,
          currentVersion: versionRange,
          requiredVersion: versionRange,
          requiredBy: [...path],
          suggestedVersion: 'Package not found'
        }]
      };
      path.pop();
      continue;
    }

    // Find best matching version with conflict awareness
    const availableVersions = versions.map(v => v.version);
    const matchingVersion = semver.maxSatisfying(availableVersions, versionRange);

    if (!matchingVersion) {
      console.log(`No matching version found for ${name}@${versionRange}`);
      const suggestedVersion = findBestAlternativeVersion(availableVersions, versionRange);
      tree[name] = {
        name,
        version: versionRange,
        dependencies: {},
        resolved: false,
        suggestedVersion,
        conflicts: [{
          dependencyName: name,
          currentVersion: versionRange,
          requiredVersion: versionRange,
          requiredBy: [...path],
          suggestedVersion
        }]
      };
      path.pop();
      continue;
    }

    // Get dependencies and known conflicts of matched version
    const matchedVersion = versions.find(v => v.version === matchingVersion);
    const subDependencies = matchedVersion?.dependency_tree || {};
    const knownConflicts = matchedVersion?.conflict_status || {};

    // Recursively resolve sub-dependencies
    const resolvedSubDeps = await resolveDependencyTree(
      subDependencies, 
      supabase, 
      new Set(visited),
      [...path]
    );

    // Analyze sub-dependency conflicts
    const subDepConflicts = analyzeSubDependencyConflicts(resolvedSubDeps);

    tree[name] = {
      name,
      version: matchingVersion,
      dependencies: resolvedSubDeps,
      resolved: true,
      conflicts: [...(knownConflicts.conflicts || []), ...subDepConflicts]
    };

    path.pop();
  }

  return tree;
}

function findBestAlternativeVersion(
  availableVersions: string[], 
  requestedRange: string
): string | undefined {
  // Sort versions in descending order
  const sortedVersions = availableVersions.sort((a, b) => 
    semver.compare(b, a)
  );

  // Try to find the closest matching version
  for (const version of sortedVersions) {
    if (semver.gtr(version, requestedRange)) {
      return version;
    }
  }

  // If no greater version found, return the highest available
  return sortedVersions[0];
}

function analyzeSubDependencyConflicts(
  dependencies: Record<string, DependencyNode>
): ConflictInfo[] {
  const conflicts: ConflictInfo[] = [];
  const versionMap = new Map<string, Set<string>>();

  // Build version map
  Object.values(dependencies).forEach(dep => {
    if (!versionMap.has(dep.name)) {
      versionMap.set(dep.name, new Set());
    }
    versionMap.get(dep.name)!.add(dep.version);
  });

  // Analyze conflicts
  for (const [name, versions] of versionMap.entries()) {
    if (versions.size > 1) {
      const allVersions = Array.from(versions);
      conflicts.push({
        dependencyName: name,
        currentVersion: allVersions[0],
        requiredVersion: allVersions[1],
        requiredBy: findDependencyUsers(dependencies, name),
        suggestedVersion: findBestAlternativeVersion(allVersions, allVersions[0])
      });
    }
  }

  return conflicts;
}

function findDependencyUsers(
  dependencies: Record<string, DependencyNode>,
  dependencyName: string
): string[] {
  const users: string[] = [];
  
  Object.entries(dependencies).forEach(([parentName, parentNode]) => {
    if (parentNode.dependencies[dependencyName]) {
      users.push(parentName);
    }
  });

  return users;
}

export function validateDependencyTree(
  tree: Record<string, DependencyNode>
): { isValid: boolean; conflicts: string[]; warnings: string[] } {
  const conflicts: string[] = [];
  const warnings: string[] = [];
  const versionMap = new Map<string, Set<string>>();

  function traverse(node: DependencyNode, path: string[] = []) {
    // Track versions for each package
    if (!versionMap.has(node.name)) {
      versionMap.set(node.name, new Set());
    }
    versionMap.get(node.name)!.add(node.version);

    // Check for circular dependencies
    if (node.circular) {
      warnings.push(
        `Circular dependency detected: ${path.join(' -> ')} -> ${node.name}`
      );
    }

    // Check for unresolved dependencies
    if (!node.resolved) {
      conflicts.push(
        `Unresolved dependency: ${node.name}@${node.version}`
      );
    }

    // Check node-specific conflicts
    if (node.conflicts?.length) {
      node.conflicts.forEach(conflict => {
        conflicts.push(
          `Version conflict in ${node.name}: ${conflict.dependencyName} ` +
          `requires ${conflict.requiredVersion} but ${conflict.currentVersion} is installed`
        );
      });
    }

    // Check sub-dependencies
    Object.entries(node.dependencies).forEach(([name, dep]) => {
      traverse(dep, [...path, node.name]);
    });
  }

  // Build version map and collect conflicts
  Object.values(tree).forEach(node => traverse(node));

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
    conflicts,
    warnings
  };
}