export interface ConflictResolutionStrategy {
  id: string;
  name: string;
  description: string;
  risk: 'low' | 'medium' | 'high';
  action: 'upgrade' | 'downgrade' | 'remove' | 'keep';
  suggestedVersion?: string;
}

export interface DependencyConflict {
  packageName: string;
  currentVersion: string;
  requiredVersion: string;
  requiredBy: string[];
  availableVersions: string[];
  suggestedStrategies: ConflictResolutionStrategy[];
}

export interface ConflictResolutionResult {
  resolved: boolean;
  appliedStrategy: ConflictResolutionStrategy;
  updatedDependencies: Record<string, string>;
}