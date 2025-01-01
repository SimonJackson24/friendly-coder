import { supabase } from "@/integrations/supabase/client";

interface HuggingFaceResponse {
  generated_text: string;
}

export async function getHuggingFaceSettings() {
  console.log("Fetching Hugging Face settings...");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data: settings, error } = await supabase
    .from("settings")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Error fetching settings:", error);
    throw error;
  }

  if (!settings?.api_key) {
    throw new Error("Hugging Face API key not configured");
  }

  return settings;
}

export async function generateResponse(prompt: string): Promise<string> {
  console.log("Generating response from Hugging Face...");
  const settings = await getHuggingFaceSettings();
  
  try {
    console.log("Using model:", settings.huggingface_model);
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${settings.huggingface_model}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${settings.api_key}`,
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            temperature: settings.temperature || 0.7,
            max_tokens: settings.max_tokens || 1000,
            return_full_text: false,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("Hugging Face API error:", error);
      throw new Error(error.error || "Failed to generate response");
    }

    const result = await response.json();
    console.log("Generated response:", result);
    
    // Handle different response formats from different models
    if (Array.isArray(result)) {
      return result[0].generated_text;
    } else if (result.generated_text) {
      return result.generated_text;
    } else {
      return result;
    }
  } catch (error) {
    console.error("Error generating response:", error);
    throw error;
  }
}