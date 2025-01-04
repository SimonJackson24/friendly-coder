import { PackageVersion } from "../types";

export const generateAutomatedChangelog = (
  currentVersion: PackageVersion,
  previousVersion: PackageVersion
): string => {
  const changes: string[] = [];

  // Compare dependencies
  const currentDeps = currentVersion.dependency_tree;
  const previousDeps = previousVersion.dependency_tree;

  // Add dependency changes
  Object.entries(currentDeps).forEach(([name, version]) => {
    if (!previousDeps[name]) {
      changes.push(`Added dependency: ${name}@${version}`);
    } else if (previousDeps[name] !== version) {
      changes.push(`Updated ${name} from ${previousDeps[name]} to ${version}`);
    }
  });

  Object.keys(previousDeps).forEach(name => {
    if (!currentDeps[name]) {
      changes.push(`Removed dependency: ${name}`);
    }
  });

  // Add package data changes
  const currentData = currentVersion.package_data;
  const previousData = previousVersion.package_data;

  Object.entries(currentData).forEach(([key, value]) => {
    if (JSON.stringify(previousData[key]) !== JSON.stringify(value)) {
      changes.push(`Updated ${key}`);
    }
  });

  return changes.join('\n');
};

export const analyzeRollbackRisk = (
  currentVersion: PackageVersion,
  targetVersion: PackageVersion
): { riskLevel: 'low' | 'medium' | 'high'; reasons: string[] } => {
  const reasons: string[] = [];
  let riskLevel: 'low' | 'medium' | 'high' = 'low';

  // Check for breaking changes in dependencies
  const currentDeps = currentVersion.dependency_tree;
  const targetDeps = targetVersion.dependency_tree;
  
  let majorVersionChanges = 0;

  Object.entries(currentDeps).forEach(([name, version]) => {
    const targetVersion = targetDeps[name];
    if (!targetVersion) {
      reasons.push(`Dependency ${name} will be removed`);
      majorVersionChanges++;
    } else if (version !== targetVersion) {
      const [currentMajor] = version.toString().split('.');
      const [targetMajor] = targetVersion.toString().split('.');
      if (currentMajor !== targetMajor) {
        reasons.push(`Major version change in ${name}: ${version} -> ${targetVersion}`);
        majorVersionChanges++;
      }
    }
  });

  // Determine risk level based on changes
  if (majorVersionChanges > 2) {
    riskLevel = 'high';
  } else if (majorVersionChanges > 0) {
    riskLevel = 'medium';
  }

  // Check for conflicts
  if (Object.keys(currentVersion.conflict_status).length > 0) {
    riskLevel = 'high';
    reasons.push('Current version has unresolved conflicts');
  }

  return { riskLevel, reasons };
};