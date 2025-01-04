import semver from 'semver';

interface ValidationResult {
  errors: string[];
  warnings: string[];
}

export function validateVersion(version: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  console.log('Validating package version:', version);

  if (!version) {
    errors.push('Version is required');
    return { errors, warnings };
  }

  // Check if version is valid semver
  if (!semver.valid(version)) {
    errors.push('Version must be a valid semantic version (e.g., 1.0.0)');
  }

  // Check for pre-release versions
  if (semver.prerelease(version)) {
    warnings.push('Pre-release versions should be used with caution');
  }

  // Check for major version 0
  if (semver.major(version) === 0) {
    warnings.push('Version 0.x.x indicates unstable API');
  }

  return { errors, warnings };
}