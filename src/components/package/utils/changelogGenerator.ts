import { PackageVersion } from "../types";
import semver from 'semver';

export const generateAutomatedChangelog = async (
  currentVersion: PackageVersion,
  previousVersion?: PackageVersion
): Promise<string> => {
  if (!previousVersion) {
    return `# Version ${currentVersion.version}\n\nInitial release`;
  }

  const changes: string[] = [];
  const breakingChanges: string[] = [];

  // Compare package data to detect changes
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

  // Format the changelog
  return [
    `# Version ${currentVersion.version}`,
    "",
    changes.length ? "## Changes\n\n" + changes.map(c => `- ${c}`).join("\n") : "",
    breakingChanges.length ? "\n## Breaking Changes\n\n" + 
      breakingChanges.map(c => `- ${c}`).join("\n") : "",
  ].filter(Boolean).join("\n");
};

export const analyzeRollbackRisk = async (
  currentVersion: PackageVersion,
  previousVersion: PackageVersion
): Promise<{ riskLevel: string; analysis: string[] }> => {
  const analysis: string[] = [];
  let riskLevel = "low";

  // Check version difference
  const versionDiff = semver.diff(currentVersion.version, previousVersion.version);
  if (versionDiff === "major") {
    analysis.push("Major version change detected - high risk of breaking changes");
    riskLevel = "high";
  }

  // Check dependency changes
  const oldDeps = previousVersion.package_data?.dependencies || {};
  const newDeps = currentVersion.package_data?.dependencies || {};

  const removedDeps = Object.keys(oldDeps).filter(dep => !newDeps[dep]);
  if (removedDeps.length) {
    analysis.push(`Removed dependencies: ${removedDeps.join(", ")}`);
    riskLevel = "high";
  }

  const addedDeps = Object.keys(newDeps).filter(dep => !oldDeps[dep]);
  if (addedDeps.length) {
    analysis.push(`Added dependencies: ${addedDeps.join(", ")}`);
    riskLevel = riskLevel === "high" ? "high" : "medium";
  }

  return {
    riskLevel,
    analysis: analysis.length ? analysis : ["No significant risks detected"]
  };
};