import { PackageVersion } from "../types";

export const generateChangelog = (
  oldVersion: PackageVersion,
  newVersion: PackageVersion
): string => {
  const changes: string[] = [];

  // Compare dependencies
  const oldDeps = oldVersion.dependency_tree || {};
  const newDeps = newVersion.dependency_tree || {};
  
  // Added dependencies
  Object.entries(newDeps).forEach(([dep, version]) => {
    if (!oldDeps[dep]) {
      changes.push(`- Added dependency: ${dep}@${version}`);
    } else if (oldDeps[dep] !== version) {
      changes.push(`- Updated ${dep} from ${oldDeps[dep]} to ${version}`);
    }
  });

  // Removed dependencies
  Object.keys(oldDeps).forEach(dep => {
    if (!newDeps[dep]) {
      changes.push(`- Removed dependency: ${dep}`);
    }
  });

  // Add package changes
  if (newVersion.changes) {
    changes.push("\nPackage Changes:");
    changes.push(newVersion.changes);
  }

  return changes.join("\n");
};

export const categorizeChanges = (changes: string): Record<string, string[]> => {
  const categories = {
    features: [],
    fixes: [],
    breaking: [],
    dependencies: [],
    other: []
  };

  const lines = changes.split("\n");
  
  lines.forEach(line => {
    if (line.toLowerCase().includes("feat:") || line.toLowerCase().includes("feature:")) {
      categories.features.push(line);
    } else if (line.toLowerCase().includes("fix:") || line.toLowerCase().includes("bugfix:")) {
      categories.fixes.push(line);
    } else if (line.toLowerCase().includes("breaking:") || line.toLowerCase().includes("!:")) {
      categories.breaking.push(line);
    } else if (line.toLowerCase().includes("dependency:") || line.toLowerCase().includes("dep:")) {
      categories.dependencies.push(line);
    } else if (line.trim()) {
      categories.other.push(line);
    }
  });

  return categories;
};