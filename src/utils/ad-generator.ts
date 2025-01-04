import { supabase } from "@/integrations/supabase/client";
import { AdFormData } from "@/components/ad-creator/AdCreatorForm";

interface ExtendedAdFormData extends AdFormData {
  projectId: string;
}

export async function generateAdContent(data: ExtendedAdFormData): Promise<string> {
  try {
    // First, fetch project files to analyze
    const { data: files, error: filesError } = await supabase
      .from('files')
      .select('content, name, path')
      .eq('project_id', data.projectId);

    if (filesError) throw filesError;

    // Generate ad content using Edge Function
    const { data: response, error } = await supabase.functions.invoke('generate-ad-content', {
      body: JSON.stringify({
        ...data,
        projectFiles: files
      })
    });

    if (error) throw error;
    return response.content;
  } catch (error) {
    console.error("Error generating ad content:", error);
    throw error;
  }
}