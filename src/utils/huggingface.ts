import Logger from "./logger";

export async function generateResponse(prompt: string, baseUrl?: string): Promise<string> {
  try {
    // Get the base URL, defaulting to window.location.origin if not provided
    const origin = baseUrl || window.location.origin;
    
    // Clean the URL by removing any trailing slashes and ensuring no trailing colon
    const cleanBaseUrl = origin.replace(/[:\/]+$/, '').replace(/:$/, '');
    
    // Construct the full API URL
    const url = `${cleanBaseUrl}/api/generate`;
    
    Logger.log('info', 'Making request to assistant API', { url, prompt });
    
    const response = await fetch(url, {
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