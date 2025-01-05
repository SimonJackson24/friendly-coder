export type AccessLevel = 'read' | 'write' | 'admin';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}