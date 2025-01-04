import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { resolveDependencyTree, validateDependencyTree } from './dependency-resolver.ts';
import { generateChangelog, detectBreakingChanges } from './changelog-generator.ts';

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
      case 'generate-changelog':
        result = await generateVersionChangelog(data, supabase);
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

async function validatePackage(data: { 
  name: string; 
  version: string; 
  dependencies: Record<string, string>;
}, supabase: any) {
  console.log('Validating package:', data);
  
  const tree = await resolveDependencyTree(data.dependencies, supabase);
  const validation = validateDependencyTree(tree);
  
  return {
    isValid: validation.isValid,
    errors: validation.conflicts,
    dependencyTree: tree
  };
}

async function resolveDependencies(data: {
  dependencies: Record<string, string>;
}, supabase: any) {
  console.log('Resolving dependencies:', data);
  
  const tree = await resolveDependencyTree(data.dependencies, supabase);
  return {
    resolved: true,
    tree,
    success: Object.values(tree).every(node => node.resolved)
  };
}

async function checkConflicts(data: {
  oldVersion: any;
  newVersion: any;
}, supabase: any) {
  console.log('Checking conflicts between versions:', data);
  
  const breakingChanges = detectBreakingChanges(data.oldVersion, data.newVersion);
  const changelog = generateChangelog(data.oldVersion, data.newVersion);
  
  return {
    hasBreakingChanges: breakingChanges.length > 0,
    breakingChanges,
    changelog
  };
}

async function generateVersionChangelog(data: {
  oldVersion: any;
  newVersion: any;
}, supabase: any) {
  console.log('Generating changelog between versions:', data);
  
  const changelog = generateChangelog(data.oldVersion, data.newVersion);
  const breakingChanges = detectBreakingChanges(data.oldVersion, data.newVersion);
  
  return {
    changes: changelog,
    breakingChanges,
    impactLevel: breakingChanges.length > 0 ? 'major' : 'minor'
  };
}