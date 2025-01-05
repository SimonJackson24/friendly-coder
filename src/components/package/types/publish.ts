import { ValidationResult } from './common';

export interface PublishStep {
  id: string;
  name: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
  message?: string;
  error?: string;
}

export interface DependencyCheck {
  name: string;
  version: string;
  compatible: boolean;
  conflicts: string[];
  suggestedVersion?: string;
  message?: string;
  requiredBy?: string[];
}

export interface PublishValidation extends ValidationResult {
  dependencyChecks: DependencyCheck[];
  breakingChanges: string[];
  dependencies: DependencyCheck[];
  publishSteps: PublishStep[];
}