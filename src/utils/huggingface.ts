import Logger from "./logger";

export async function generateResponse(prompt: string, baseUrl?: string): Promise<string> {
  try {
    // Clean the base URL by removing any trailing slashes and colons
    const cleanBaseUrl = (baseUrl || window.location.origin).replace(/[:\/]+$/, '');
    const url = `${cleanBaseUrl}/api/generate`;
    
    Logger.log('info', 'Making request to assistant API', { url });
    
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