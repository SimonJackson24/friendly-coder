import { supabase } from "@/integrations/supabase/client";

export async function generateResponse(prompt: string): Promise<string> {
  console.log("Generating response for prompt:", prompt);
  
  try {
    const { data: response, error } = await supabase.functions.invoke('generate-claude-response', {
      body: { prompt }
    });

    if (error) {
      console.error("Error generating response:", error);
      throw new Error(error.message);
    }

    if (response.error) {
      console.error("API error:", response.error);
      throw new Error(response.error);
    }

    console.log("Generated response:", response);
    return response.response;
  } catch (error) {
    console.error("Failed to generate response:", error);
    throw new Error("Failed to generate response. Please try again.");
  }
}