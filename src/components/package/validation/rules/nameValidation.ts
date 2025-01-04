interface ValidationResult {
  errors: string[];
  warnings: string[];
}

export function validatePackageName(name: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  console.log('Validating package name:', name);

  if (!name) {
    errors.push('Package name is required');
    return { errors, warnings };
  }

  // Check for valid characters
  if (!/^[a-zA-Z0-9-_]+$/.test(name)) {
    errors.push('Package name can only contain letters, numbers, hyphens, and underscores');
  }

  // Check length
  if (name.length < 3) {
    errors.push('Package name must be at least 3 characters long');
  }
  if (name.length > 214) {
    errors.push('Package name cannot exceed 214 characters');
  }

  // Check for reserved words
  const reservedWords = ['node_modules', 'favicon.ico'];
  if (reservedWords.includes(name.toLowerCase())) {
    errors.push('Package name cannot be a reserved word');
  }

  // Add warnings for potential issues
  if (name.startsWith('.') || name.startsWith('_')) {
    warnings.push('Package names starting with dots or underscores are discouraged');
  }

  return { errors, warnings };
}