import { DependencyCheck, PackageValidation, PublishValidation } from "../types";
import { validateDependencies } from "./rules/dependencyValidation";
import { validateDescription } from "./rules/descriptionValidation";
import { validateName } from "./rules/nameValidation";
import { validateVersion } from "./rules/versionValidation";

export async function validatePackage(
  name: string,
  version: string,
  description: string,
  dependencies: Record<string, string>
): Promise<PackageValidation> {
  const nameValidation = validateName(name);
  const versionValidation = validateVersion(version);
  const descriptionValidation = validateDescription(description);
  const dependencyValidation = await validateDependencies(dependencies);

  const errors: string[] = [];
  const warnings: string[] = [];

  if (!nameValidation.valid) errors.push(nameValidation.error);
  if (!versionValidation.valid) errors.push(versionValidation.error);
  if (!descriptionValidation.valid) errors.push(descriptionValidation.error);

  const dependencyChecks = dependencyValidation.map(dep => ({
    name: dep.name,
    version: dep.version,
    compatible: dep.compatible,
    conflicts: dep.conflicts,
    suggestedVersion: dep.suggestedVersion,
    message: dep.message
  }));

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    dependencies: dependencyChecks
  };
}