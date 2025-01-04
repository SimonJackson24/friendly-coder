import { ValidationResult, DependencyCheck } from "../types";

export const validatePackage = async (
  name: string,
  version: string,
  description: string,
  dependencies: Record<string, string>
): Promise<ValidationResult> => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate name
  if (!name) {
    errors.push("Package name is required");
  } else if (name.length < 3) {
    errors.push("Package name must be at least 3 characters long");
  }

  // Validate version
  const versionResult = validateVersion(version);
  if (!versionResult.valid) {
    errors.push(...versionResult.errors);
  }

  // Validate description
  const descriptionResult = validateDescription(description);
  if (!descriptionResult.valid) {
    errors.push(...descriptionResult.errors);
  }

  // Validate dependencies
  const dependencyResult = await validateDependencies(dependencies);
  errors.push(...dependencyResult.map(d => d.message || "").filter(Boolean));
  warnings.push(...dependencyResult.map(d => d.suggestedVersion ? 
    `Consider updating ${d.name} to ${d.suggestedVersion}` : "").filter(Boolean));

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
};

const validateVersion = (version: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!version) {
    errors.push("Version is required");
  } else if (!/^\d+\.\d+\.\d+$/.test(version)) {
    errors.push("Version must be in format x.y.z");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings: []
  };
};

const validateDescription = (description: string): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!description) {
    errors.push("Description is required");
  } else if (description.length < 10) {
    warnings.push("Consider adding a more detailed description");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
};

const validateDependencies = async (
  dependencies: Record<string, string>
): Promise<DependencyCheck[]> => {
  const checks: DependencyCheck[] = [];

  for (const [name, version] of Object.entries(dependencies)) {
    checks.push({
      name,
      version,
      compatible: true,
      conflicts: [],
      suggestedVersion: undefined,
      message: undefined
    });
  }

  return checks;
};