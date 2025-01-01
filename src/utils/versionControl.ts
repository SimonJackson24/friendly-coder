import { supabase } from "@/integrations/supabase/client";
import Logger from "./logger";

export interface VersionEntry {
  id: string;
  file_id: string;
  content: string;
  version_number: number;
  commit_message: string;
  build_status: string;
  error_logs: string[];
  created_at: string;
}

export async function saveVersion(
  projectId: string,
  fileId: string,
  content: string,
  commitMessage: string
) {
  try {
    Logger.log('info', 'Saving new version', { projectId, fileId });
    
    // Get next version number using the database function
    const { data: versionData, error: versionError } = await supabase
      .rpc('get_next_version_number', {
        p_project_id: projectId,
        p_file_id: fileId
      });

    if (versionError) {
      Logger.log('error', 'Failed to get next version number', { error: versionError });
      throw versionError;
    }

    const { data, error } = await supabase
      .from('version_history')
      .insert({
        project_id: projectId,
        file_id: fileId,
        content,
        version_number: versionData,
        commit_message: commitMessage,
      })
      .select()
      .single();

    if (error) {
      Logger.log('error', 'Failed to save version', { error });
      throw error;
    }

    Logger.log('info', 'Version saved successfully', { versionNumber: versionData });
    return data;
  } catch (error) {
    Logger.log('error', 'Error in saveVersion', { error });
    throw error;
  }
}

export async function getFileVersions(projectId: string, fileId: string) {
  try {
    Logger.log('info', 'Fetching file versions', { projectId, fileId });
    
    const { data, error } = await supabase
      .from('version_history')
      .select('*')
      .eq('project_id', projectId)
      .eq('file_id', fileId)
      .order('version_number', { ascending: false });

    if (error) {
      Logger.log('error', 'Failed to fetch versions', { error });
      throw error;
    }

    return data as VersionEntry[];
  } catch (error) {
    Logger.log('error', 'Error in getFileVersions', { error });
    throw error;
  }
}