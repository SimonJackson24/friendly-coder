import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import semver from 'https://esm.sh/semver@7.5.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

console.log("Loading package operations handler...");

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { operation, data } = await req.json();
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`Processing ${operation} operation with data:`, data);

    let result;
    switch (operation) {
      case 'validate-package':
        result = await validatePackage(data, supabase);
        break;
      case 'resolve-dependencies':
        result = await resolveDependencies(data, supabase);
        break;
      case 'check-conflicts':
        result = await checkConflicts(data, supabase);
        break;
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error in package operations:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function validatePackage(data: { name: string; version: string; description?: string }, supabase: any) {
  console.log('Validating package:', data);
  
  const validation = {
    isValid: true,
    errors: [] as string[],
    warnings: [] as string[],
    dependencies: [] as any[],
    dependencyChecks: [] as any[],
    breakingChanges: [] as string[],
  };

  // Validate package name
  if (!/^[a-z0-9-]+$/.test(data.name)) {
    validation.errors.push("Package name can only contain lowercase letters, numbers, and hyphens");
    validation.isValid = false;
  }

  // Validate version format (semver)
  if (!semver.valid(data.version)) {
    validation.errors.push("Version must follow semantic versioning format (e.g., 1.0.0)");
    validation.isValid = false;
  }

  // Check for existing package
  const { data: existingPackage } = await supabase
    .from('packages')
    .select('version')
    .eq('name', data.name)
    .single();

  if (existingPackage) {
    if (semver.lte(data.version, existingPackage.version)) {
      validation.errors.push(`Version must be greater than existing version ${existingPackage.version}`);
      validation.isValid = false;
    }
    
    // Check for breaking changes
    if (semver.major(data.version) > semver.major(existingPackage.version)) {
      validation.warnings.push("This is a major version bump. Please ensure all breaking changes are documented.");
    }
  }

  // Add warnings for best practices
  if (!data.description) {
    validation.warnings.push("Adding a description is recommended for better discoverability");
  }

  return validation;
}

async function resolveDependencies(data: { 
  name: string; 
  version: string; 
  dependencies: Record<string, string>;
}, supabase: any) {
  console.log('Resolving dependencies for:', data);
  
  const resolvedDeps = new Map<string, string>();
  const conflicts = new Map<string, { required: string; available: string[] }>();
  
  for (const [depName, versionRange] of Object.entries(data.dependencies)) {
    const { data: versions } = await supabase
      .from('package_versions')
      .select('version')
      .eq('name', depName)
      .order('created_at', { ascending: false });

    if (!versions?.length) {
      conflicts.set(depName, { required: versionRange, available: [] });
      continue;
    }

    const availableVersions = versions.map(v => v.version);
    const matchingVersion = semver.maxSatisfying(availableVersions, versionRange);

    if (matchingVersion) {
      resolvedDeps.set(depName, matchingVersion);
    } else {
      conflicts.set(depName, { required: versionRange, available: availableVersions });
    }
  }

  return {
    resolved: Object.fromEntries(resolvedDeps),
    conflicts: Object.fromEntries(conflicts),
    success: conflicts.size === 0
  };
}

async function checkConflicts(data: { 
  name: string; 
  version: string; 
  dependencies: Record<string, string>;
}, supabase: any) {
  console.log('Checking conflicts for:', data);
  
  const conflicts = [];
  const dependencyTree = new Map();
  
  // Build dependency tree and check for conflicts
  for (const [name, version] of Object.entries(data.dependencies)) {
    const { data: dependentPackages } = await supabase
      .from('package_versions')
      .select(`
        id,
        version,
        dependency_tree,
        package:packages(name)
      `)
      .eq('packages.name', name)
      .order('created_at', { ascending: false });

    if (dependentPackages?.length) {
      const latestVersion = dependentPackages[0].version;
      const tree = dependentPackages[0].dependency_tree;
      
      dependencyTree.set(name, {
        version: latestVersion,
        tree
      });

      // Check version compatibility
      if (!semver.satisfies(latestVersion, version)) {
        conflicts.push({
          package: name,
          required: version,
          available: latestVersion,
          type: 'version_mismatch'
        });
      }

      // Check for circular dependencies
      if (tree && hasCircularDependency(data.name, tree)) {
        conflicts.push({
          package: name,
          type: 'circular_dependency'
        });
      }
    }
  }

  return {
    hasConflicts: conflicts.length > 0,
    conflicts,
    dependencyTree: Object.fromEntries(dependencyTree)
  };
}

function hasCircularDependency(packageName: string, tree: any, visited = new Set<string>()): boolean {
  if (visited.has(packageName)) return true;
  visited.add(packageName);

  for (const dep of Object.keys(tree)) {
    if (hasCircularDependency(dep, tree[dep], new Set(visited))) {
      return true;
    }
  }

  return false;
}