export interface Package {
  id: string;
  name: string;
  version: string;
  description: string;
  is_private: boolean;
  author_id: string;
  package_data: any;
}

export interface PackageValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  dependencies: DependencyCheck[];
}

export interface DependencyCheck {
  name: string;
  version: string;
  isCompatible: boolean;
  conflicts: string[];
  requiredBy: string[];
  suggestedVersion?: string;
}

export interface PublishStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
  error?: string;
}

export interface PublishValidation extends PackageValidation {
  dependencyChecks: DependencyCheck[];
  breakingChanges: string[];
  publishSteps: PublishStep[];
}
