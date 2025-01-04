import { PackageVersion } from "../../types";
import { supabase } from "@/integrations/supabase/client";

export async function generateChangelog(
  currentVersion: PackageVersion,
  previousVersion?: PackageVersion
): Promise<string> {
  if (!previousVersion) {
    return `# Version ${currentVersion.version}\n\nInitial release`;
  }

  const changes: string[] = [];
  const breakingChanges: string[] = [];

  // Compare package data to detect changes
  const oldData = previousVersion.package_data;
  const newData = currentVersion.package_data;

  // Check for dependency changes
  if (oldData.dependencies !== newData.dependencies) {
    const addedDeps = Object.keys(newData.dependencies || {})
      .filter(dep => !oldData.dependencies?.[dep]);
    
    const removedDeps = Object.keys(oldData.dependencies || {})
      .filter(dep => !newData.dependencies?.[dep]);
    
    const updatedDeps = Object.entries(newData.dependencies || {})
      .filter(([dep, version]) => 
        oldData.dependencies?.[dep] && oldData.dependencies[dep] !== version
      );

    if (addedDeps.length) {
      changes.push(`Added dependencies: ${addedDeps.join(", ")}`);
    }
    if (removedDeps.length) {
      changes.push(`Removed dependencies: ${removedDeps.join(", ")}`);
    }
    if (updatedDeps.length) {
      changes.push(`Updated dependencies: ${updatedDeps.map(([dep, version]) => 
        `${dep} to ${version}`).join(", ")}`);
    }
  }

  // Save changelog to database
  const { error } = await supabase
    .from("release_notes")
    .insert({
      package_id: currentVersion.package_id,
      version: currentVersion.version,
      title: `Release ${currentVersion.version}`,
      changes,
      breaking_changes: breakingChanges,
    });

  if (error) {
    console.error("Error saving changelog:", error);
  }

  // Format the changelog
  return [
    `# Version ${currentVersion.version}`,
    "",
    changes.length ? "## Changes\n\n" + changes.map(c => `- ${c}`).join("\n") : "",
    breakingChanges.length ? "\n## Breaking Changes\n\n" + 
      breakingChanges.map(c => `- ${c}`).join("\n") : "",
  ].filter(Boolean).join("\n");
}