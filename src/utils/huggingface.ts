import { supabase } from "@/integrations/supabase/client";
import Logger from "@/utils/logger";

export async function generateResponse(prompt: string): Promise<string> {
  Logger.log('info', 'Generating response for prompt:', { prompt });
  
  try {
    const { data, error } = await supabase.functions.invoke('generate-claude-response', {
      body: { prompt }
    });

    if (error) {
      Logger.log('error', 'Error calling Edge Function:', { error });
      throw new Error(error.message || "Failed to generate response");
    }

    if (!data || !data.response) {
      Logger.log('error', 'Invalid response format:', { data });
      throw new Error("Invalid response format from Claude");
    }

    Logger.log('info', 'Received response from Claude:', { response: data.response });
    return data.response;
  } catch (error) {
    Logger.log('error', 'Error generating response:', { error });
    throw error;
  }
}