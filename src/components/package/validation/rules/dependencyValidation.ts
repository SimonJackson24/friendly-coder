import { DependencyCheck } from "../../types";
import semver from 'semver';

export const validateDependencies = async (
  dependencies: Record<string, string>
): Promise<DependencyCheck[]> => {
  const checks: DependencyCheck[] = [];

  for (const [name, version] of Object.entries(dependencies)) {
    try {
      // Fetch package info from npm registry
      const response = await fetch(`https://registry.npmjs.org/${name}`);
      const packageInfo = await response.json();

      const latestVersion = packageInfo['dist-tags'].latest;
      const isCompatible = semver.satisfies(latestVersion, version);
      const hasBreakingChanges = semver.major(latestVersion) > semver.major(version);

      checks.push({
        name,
        version,
        compatible: isCompatible,
        conflicts: hasBreakingChanges ? [`Major version mismatch with latest (${latestVersion})`] : [],
        suggestedVersion: hasBreakingChanges ? latestVersion : undefined,
        message: hasBreakingChanges 
          ? `Consider updating to latest version ${latestVersion}`
          : undefined
      });
    } catch (error) {
      checks.push({
        name,
        version,
        compatible: false,
        conflicts: ['Failed to validate dependency'],
        message: 'Error checking version compatibility'
      });
    }
  }

  return checks;
};