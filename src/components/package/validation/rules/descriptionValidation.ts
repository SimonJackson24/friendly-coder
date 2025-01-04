interface ValidationResult {
  errors: string[];
  warnings: string[];
}

export function validateDescription(description: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  console.log('Validating package description:', description);

  if (!description) {
    warnings.push('A description is recommended for better package discoverability');
    return { errors, warnings };
  }

  // Check length
  if (description.length < 10) {
    warnings.push('Description should be at least 10 characters for better clarity');
  }
  if (description.length > 1000) {
    errors.push('Description cannot exceed 1000 characters');
  }

  // Check for markdown
  if (description.includes('```') || description.includes('###')) {
    warnings.push('Markdown syntax in description may not render correctly in all package managers');
  }

  return { errors, warnings };
}