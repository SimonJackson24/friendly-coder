import Logger from "./logger";

export async function generateResponse(prompt: string, baseUrl?: string): Promise<string> {
  try {
    // Use the provided baseUrl or fallback to window.location.origin
    const url = baseUrl || window.location.origin;
    // Ensure there are no trailing colons and the path is properly formatted
    const cleanUrl = `${url.replace(/:\/?$/, '')}/api/generate`;
    
    Logger.log('info', 'Making request to assistant API', { url: cleanUrl });
    
    const response = await fetch(cleanUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    Logger.log('error', 'Failed to generate response', { error });
    throw error;
  }
}