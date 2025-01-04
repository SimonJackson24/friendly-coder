import { PackageVersion } from "../types";
import { supabase } from "@/integrations/supabase/client";

interface ChangelogEntry {
  type: 'feature' | 'bugfix' | 'breaking' | 'maintenance';
  description: string;
}

export async function generateAutomatedChangelog(
  currentVersion: PackageVersion,
  previousVersion?: PackageVersion
): Promise<string> {
  console.log('Generating changelog for version:', currentVersion.version);
  
  const entries: ChangelogEntry[] = [];

  // Compare dependencies
  const oldDeps = previousVersion?.package_data?.dependencies || {};
  const newDeps = currentVersion.package_data?.dependencies || {};

  // Check for added dependencies
  Object.entries(newDeps).forEach(([dep, version]) => {
    if (!oldDeps[dep]) {
      entries.push({
        type: 'feature',
        description: `Added dependency: ${dep}@${version}`
      });
    } else if (oldDeps[dep] !== version) {
      // Check if it's a major version bump
      const oldMajor = parseInt(oldDeps[dep].toString().split('.')[0]);
      const newMajor = parseInt(version.toString().split('.')[0]);
      
      if (newMajor > oldMajor) {
        entries.push({
          type: 'breaking',
          description: `Updated ${dep} from ${oldDeps[dep]} to ${version} (major version bump)`
        });
      } else {
        entries.push({
          type: 'maintenance',
          description: `Updated ${dep} from ${oldDeps[dep]} to ${version}`
        });
      }
    }
  });

  // Check for removed dependencies
  Object.keys(oldDeps).forEach(dep => {
    if (!newDeps[dep]) {
      entries.push({
        type: 'breaking',
        description: `Removed dependency: ${dep}`
      });
    }
  });

  // Save changelog template
  try {
    const { error } = await supabase
      .from('changelog_templates')
      .insert({
        package_id: currentVersion.package_id,
        template_type: 'automated',
        template_content: JSON.stringify(entries)
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error saving changelog template:', error);
  }

  // Format the changelog
  const sections = {
    breaking: entries.filter(e => e.type === 'breaking'),
    feature: entries.filter(e => e.type === 'feature'),
    maintenance: entries.filter(e => e.type === 'maintenance'),
    bugfix: entries.filter(e => e.type === 'bugfix')
  };

  let changelog = `# Version ${currentVersion.version}\n\n`;

  if (sections.breaking.length) {
    changelog += '## Breaking Changes\n\n';
    sections.breaking.forEach(entry => {
      changelog += `- ${entry.description}\n`;
    });
    changelog += '\n';
  }

  if (sections.feature.length) {
    changelog += '## New Features\n\n';
    sections.feature.forEach(entry => {
      changelog += `- ${entry.description}\n`;
    });
    changelog += '\n';
  }

  if (sections.maintenance.length) {
    changelog += '## Maintenance\n\n';
    sections.maintenance.forEach(entry => {
      changelog += `- ${entry.description}\n`;
    });
    changelog += '\n';
  }

  if (sections.bugfix.length) {
    changelog += '## Bug Fixes\n\n';
    sections.bugfix.forEach(entry => {
      changelog += `- ${entry.description}\n`;
    });
    changelog += '\n';
  }

  return changelog;
}

export async function analyzeRollbackRisk(
  fromVersion: PackageVersion,
  toVersion: PackageVersion
): Promise<{ riskLevel: 'low' | 'medium' | 'high', analysis: string[] }> {
  const risks: string[] = [];
  let riskLevel: 'low' | 'medium' | 'high' = 'low';

  // Compare dependencies
  const oldDeps = fromVersion.package_data?.dependencies || {};
  const newDeps = toVersion.package_data?.dependencies || {};

  // Check for breaking changes
  let breakingChanges = 0;
  Object.entries(newDeps).forEach(([dep, version]) => {
    if (!oldDeps[dep]) {
      risks.push(`Risk: New dependency ${dep} will be removed`);
      breakingChanges++;
    } else if (oldDeps[dep] !== version) {
      const oldMajor = parseInt(oldDeps[dep].toString().split('.')[0]);
      const newMajor = parseInt(version.toString().split('.')[0]);
      
      if (newMajor > oldMajor) {
        risks.push(`Risk: Major version downgrade for ${dep} from ${version} to ${oldDeps[dep]}`);
        breakingChanges++;
      }
    }
  });

  // Determine risk level
  if (breakingChanges > 2) {
    riskLevel = 'high';
  } else if (breakingChanges > 0) {
    riskLevel = 'medium';
  }

  // Save analysis
  try {
    const { error } = await supabase
      .from('rollback_analysis')
      .insert({
        package_id: fromVersion.package_id,
        version_from: fromVersion.version,
        version_to: toVersion.version,
        impact_analysis: risks,
        risk_level: riskLevel
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error saving rollback analysis:', error);
  }

  return { riskLevel, analysis: risks };
}