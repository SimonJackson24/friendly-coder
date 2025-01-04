import { DependencyCheck } from "../../types";
import { supabase } from "@/integrations/supabase/client";

interface ValidationResult {
  errors: string[];
  warnings: string[];
  dependencies: DependencyCheck[];
}

export async function validateDependencies(
  dependencies: Record<string, string>
): Promise<ValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];
  const dependencyChecks: DependencyCheck[] = [];
  
  console.log('Validating dependencies:', dependencies);

  for (const [name, version] of Object.entries(dependencies)) {
    console.log(`Checking dependency: ${name}@${version}`);
    
    try {
      const { data: versions, error } = await supabase
        .from('package_versions')
        .select('version, dependency_tree, conflict_status')
        .eq('name', name)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!versions?.length) {
        errors.push(`Package ${name} not found in registry`);
        continue;
      }

      const check: DependencyCheck = {
        name,
        version,
        isCompatible: true,
        conflicts: [],
        requiredBy: [],
      };

      // Check for version compatibility
      const matchingVersion = versions.find(v => v.version === version);
      if (!matchingVersion) {
        check.isCompatible = false;
        check.conflicts.push(`Version ${version} not found`);
        check.suggestedVersion = versions[0].version;
      } else {
        // Parse conflict_status as JSON if it's a string
        const conflictStatus = typeof matchingVersion.conflict_status === 'string' 
          ? JSON.parse(matchingVersion.conflict_status)
          : matchingVersion.conflict_status;

        if (conflictStatus?.conflicts?.length > 0) {
          check.isCompatible = false;
          check.conflicts.push(...conflictStatus.conflicts);
        }
      }

      dependencyChecks.push(check);

    } catch (error) {
      console.error(`Error validating dependency ${name}:`, error);
      errors.push(`Failed to validate dependency ${name}`);
    }
  }

  return {
    errors,
    warnings,
    dependencies: dependencyChecks
  };
}