import Logger from "./logger";

export async function generateResponse(prompt: string, baseUrl?: string): Promise<string> {
  try {
    // Get the base URL, removing any trailing slashes
    const origin = (baseUrl || window.location.origin).replace(/\/+$/, '');
    
    Logger.log('info', 'Generating response', { 
      prompt,
      baseUrl: origin
    });

    const response = await fetch(`${origin}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      Logger.log('error', 'Failed to generate response', { 
        status: response.status,
        statusText: response.statusText 
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    Logger.log('info', 'Successfully generated response');
    return data.response;
  } catch (error) {
    Logger.log('error', 'Failed to generate response', { error });
    throw error;
  }
}