import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

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
        result = await validatePackage(data);
        break;
      case 'rollback-version':
        result = await rollbackVersion(data, supabase);
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

async function validatePackage(data: { name: string; version: string; description?: string }) {
  const validation = {
    isValid: true,
    errors: [] as string[],
    warnings: [] as string[],
    dependencies: [] as any[],
  };

  // Validate package name
  if (!/^[a-z0-9-]+$/.test(data.name)) {
    validation.errors.push("Package name can only contain lowercase letters, numbers, and hyphens");
    validation.isValid = false;
  }

  // Validate version format (semver)
  if (!/^\d+\.\d+\.\d+(-[0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*)?(\+[0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*)?$/.test(data.version)) {
    validation.errors.push("Version must follow semantic versioning format (e.g., 1.0.0)");
    validation.isValid = false;
  
  }

  // Add warnings for best practices
  if (!data.description) {
    validation.warnings.push("Adding a description is recommended for better discoverability");
  }

  // Mock dependency check (replace with actual dependency resolution)
  validation.dependencies = [
    {
      name: "example-dep",
      version: "1.0.0",
      isCompatible: true,
      conflicts: [],
    }
  ];

  return validation;
}

async function rollbackVersion(data: { packageId: string; versionId: string }, supabase: any) {
  const { packageId, versionId } = data;

  // Get the version to rollback to
  const { data: versionData, error: versionError } = await supabase
    .from('package_versions')
    .select('*')
    .eq('id', versionId)
    .single();

  if (versionError) throw versionError;

  // Create a new version with the rolled back data
  const { data: newVersion, error: createError } = await supabase
    .from('package_versions')
    .insert({
      package_id: packageId,
      version: `${versionData.version}-rollback`,
      package_data: versionData.package_data,
      changes: `Rollback to version ${versionData.version}`,
    })
    .select()
    .single();

  if (createError) throw createError;

  return newVersion;
}