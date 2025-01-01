import { supabase } from "@/integrations/supabase/client";

export async function generateResponse(prompt: string): Promise<string> {
  console.log("Generating response for prompt:", prompt);
  
  try {
    const { data, error } = await supabase.functions.invoke('generate-claude-response', {
      body: { prompt }
    });

    if (error) {
      console.error("Error calling Edge Function:", error);
      throw new Error("Failed to generate response");
    }

    console.log("Received response from Claude:", data);
    return data.response;
  } catch (error) {
    console.error("Error generating response:", error);
    throw error;
  }
}