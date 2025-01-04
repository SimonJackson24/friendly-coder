import { supabase } from "@/integrations/supabase/client";
import { AdFormData } from "@/components/ad-creator/AdCreatorForm";

export async function generateAdContent(data: AdFormData): Promise<string> {
  try {
    const { data: response, error } = await supabase.functions.invoke('generate-ad-content', {
      body: JSON.stringify(data)
    });

    if (error) throw error;
    return response.content;
  } catch (error) {
    console.error("Error generating ad content:", error);
    throw error;
  }
}