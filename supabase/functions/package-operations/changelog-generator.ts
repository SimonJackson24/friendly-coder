interface ChangelogEntry {
  type: 'feature' | 'bugfix' | 'breaking' | 'maintenance';
  description: string;
}

export function generateChangelog(
  oldVersion: any,
  newVersion: any
): ChangelogEntry[] {
  const changes: ChangelogEntry[] = [];
  
  // Compare dependencies
  const oldDeps = oldVersion?.package_data?.dependencies || {};
  const newDeps = newVersion?.package_data?.dependencies || {};
  
  // Check for added dependencies
  Object.entries(newDeps).forEach(([dep, version]) => {
    if (!oldDeps[dep]) {
      changes.push({
        type: 'feature',
        description: `Added dependency: ${dep}@${version}`
      });
    } else if (oldDeps[dep] !== version) {
      // Check if it's a major version bump
      if (
        semver.major(version as string) > 
        semver.major(oldDeps[dep] as string)
      ) {
        changes.push({
          type: 'breaking',
          description: `Updated ${dep} from ${oldDeps[dep]} to ${version} (major version bump)`
        });
      } else {
        changes.push({
          type: 'maintenance',
          description: `Updated ${dep} from ${oldDeps[dep]} to ${version}`
        });
      }
    }
  });

  // Check for removed dependencies
  Object.keys(oldDeps).forEach(dep => {
    if (!newDeps[dep]) {
      changes.push({
        type: 'breaking',
        description: `Removed dependency: ${dep}`
      });
    }
  });

  return changes;
}

export function detectBreakingChanges(
  oldVersion: any,
  newVersion: any
): string[] {
  const breakingChanges: string[] = [];

  // Check version bump type
  if (
    semver.major(newVersion.version) > 
    semver.major(oldVersion.version)
  ) {
    breakingChanges.push(
      `Major version bump from ${oldVersion.version} to ${newVersion.version}`
    );
  }

  // Add breaking changes from changelog
  const changelog = generateChangelog(oldVersion, newVersion);
  changelog
    .filter(entry => entry.type === 'breaking')
    .forEach(entry => breakingChanges.push(entry.description));

  return breakingChanges;
}