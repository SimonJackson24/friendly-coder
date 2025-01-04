import { Package, PackageValidation, DependencyCheck } from "../types";
import { validatePackageName } from "./rules/nameValidation";
import { validateVersion } from "./rules/versionValidation";
import { validateDescription } from "./rules/descriptionValidation";
import { validateDependencies } from "./rules/dependencyValidation";

export async function validatePackage(
  name: string,
  version: string,
  description: string,
  dependencies: Record<string, string>
): Promise<PackageValidation> {
  console.log('Validating package:', { name, version, description, dependencies });
  
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Name validation
  const nameValidation = validatePackageName(name);
  errors.push(...nameValidation.errors);
  warnings.push(...nameValidation.warnings);

  // Version validation
  const versionValidation = validateVersion(version);
  errors.push(...versionValidation.errors);
  warnings.push(...versionValidation.warnings);

  // Description validation
  const descriptionValidation = validateDescription(description);
  errors.push(...descriptionValidation.errors);
  warnings.push(...descriptionValidation.warnings);

  // Dependencies validation
  const dependencyValidation = await validateDependencies(dependencies);
  errors.push(...dependencyValidation.errors);
  warnings.push(...dependencyValidation.warnings);

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    dependencies: dependencyValidation.dependencies
  };
}