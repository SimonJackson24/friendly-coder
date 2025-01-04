import semver from 'semver';
import type { DependencyConflict, ConflictResolutionStrategy } from './types';

export function generateResolutionStrategies(
  conflict: DependencyConflict
): ConflictResolutionStrategy[] {
  const strategies: ConflictResolutionStrategy[] = [];
  const { currentVersion, requiredVersion, availableVersions } = conflict;

  // Find latest version that satisfies both requirements
  const compatibleVersion = availableVersions.find(version => 
    semver.satisfies(version, `>=${currentVersion}`) && 
    semver.satisfies(version, requiredVersion)
  );

  if (compatibleVersion) {
    strategies.push({
      id: 'upgrade-compatible',
      name: `Upgrade to ${compatibleVersion}`,
      description: `Upgrade to version ${compatibleVersion} which satisfies all requirements`,
      risk: 'low',
      action: 'upgrade'
    });
  }

  // If required version is newer
  if (semver.gt(requiredVersion, currentVersion)) {
    strategies.push({
      id: 'upgrade-required',
      name: `Upgrade to ${requiredVersion}`,
      description: `Upgrade to the required version ${requiredVersion}`,
      risk: 'medium',
      action: 'upgrade'
    });
  }

  // If current version is newer
  if (semver.gt(currentVersion, requiredVersion)) {
    strategies.push({
      id: 'keep-current',
      name: 'Keep current version',
      description: `Keep the current version ${currentVersion} and update dependents`,
      risk: 'medium',
      action: 'keep'
    });
  }

  // Add fallback strategy
  strategies.push({
    id: 'remove-dependency',
    name: 'Remove dependency',
    description: 'Remove this dependency and all packages that require it',
    risk: 'high',
    action: 'remove'
  });

  return strategies;
}

export function applyResolutionStrategy(
  dependencies: Record<string, string>,
  conflict: DependencyConflict,
  strategy: ConflictResolutionStrategy
): Record<string, string> {
  const newDependencies = { ...dependencies };

  switch (strategy.action) {
    case 'upgrade':
      newDependencies[conflict.packageName] = conflict.requiredVersion;
      break;
    case 'downgrade':
      newDependencies[conflict.packageName] = conflict.currentVersion;
      break;
    case 'remove':
      delete newDependencies[conflict.packageName];
      // Also remove packages that require this dependency
      conflict.requiredBy.forEach(dep => {
        delete newDependencies[dep];
      });
      break;
    case 'keep':
      // Keep current version, no changes needed
      break;
  }

  return newDependencies;
}