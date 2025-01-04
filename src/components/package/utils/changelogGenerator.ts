import { PackageVersion } from "../types";

export const generateChangelog = async (
  currentVersion: PackageVersion,
  previousVersion?: PackageVersion
): Promise<string> => {
  if (!previousVersion) {
    return `# Version ${currentVersion.version}\n\nInitial release`;
  }

  const changes: string[] = [];

  // Compare package data
  const oldData = previousVersion.package_data;
  const newData = currentVersion.package_data;

  // Check for dependency changes
  if (oldData.dependencies !== newData.dependencies) {
    const addedDeps = Object.keys(newData.dependencies || {})
      .filter(dep => !oldData.dependencies?.[dep]);
    
    const removedDeps = Object.keys(oldData.dependencies || {})
      .filter(dep => !newData.dependencies?.[dep]);
    
    const updatedDeps = Object.entries(newData.dependencies || {})
      .filter(([dep, version]) => 
        oldData.dependencies?.[dep] && oldData.dependencies[dep] !== version
      );

    if (addedDeps.length) {
      changes.push(`Added dependencies: ${addedDeps.join(", ")}`);
    }
    if (removedDeps.length) {
      changes.push(`Removed dependencies: ${removedDeps.join(", ")}`);
    }
    if (updatedDeps.length) {
      changes.push(`Updated dependencies: ${updatedDeps.map(([dep, version]) => 
        `${dep} to ${version}`).join(", ")}`);
    }
  }

  return [
    `# Version ${currentVersion.version}`,
    "",
    changes.length ? "## Changes\n\n" + changes.map(c => `- ${c}`).join("\n") : "",
  ].filter(Boolean).join("\n");
};