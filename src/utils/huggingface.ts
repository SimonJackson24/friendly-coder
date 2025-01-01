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
  
  const modelParameters = settings.model_parameters as {
    compute_type: string;
    instance_tier: string;
    auto_scaling: {
      enabled: boolean;
      idle_timeout: number;
      min_replicas: number;
      max_replicas: number;
    };
  };

  try {
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
            temperature: settings.temperature,
            max_tokens: settings.max_tokens,
            compute_type: modelParameters.compute_type,
            instance_tier: modelParameters.instance_tier,
            auto_scaling: modelParameters.auto_scaling,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("Hugging Face API error:", error);
      throw new Error(error.error || "Failed to generate response");
    }

    const result: HuggingFaceResponse = await response.json();
    return result.generated_text;
  } catch (error) {
    console.error("Error generating response:", error);
    throw error;
  }
}