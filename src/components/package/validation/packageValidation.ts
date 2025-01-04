import { ValidationResult } from "../types";
import { validateDependencies } from "./rules/dependencyValidation";
import { validateDescription } from "./rules/descriptionValidation";
import { validateVersion } from "./rules/versionValidation";

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
  if (!versionResult.isValid) {
    errors.push(...versionResult.errors);
  }

  // Validate description
  const descriptionResult = validateDescription(description);
  if (!descriptionResult.isValid) {
    errors.push(...descriptionResult.errors);
  }

  // Validate dependencies
  const dependencyResult = await validateDependencies(dependencies);
  if (!dependencyResult.isValid) {
    errors.push(...dependencyResult.errors);
  }
  warnings.push(...dependencyResult.warnings);

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};