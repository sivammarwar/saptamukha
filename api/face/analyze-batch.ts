export const config = {
  runtime: 'edge',
};

const HF_SPACE_URL = 'https://sivamarwar-saptamukha.hf.space';
const HF_TOKEN = process.env.HF_TOKEN;

export default async function handler(request: Request) {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-API-Key, Authorization',
        'Access-Control-Max-Age': '86400'
      }
    });
  }

  // Only allow POST
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  try {
    console.log(`[Edge Function] POST /api/face/analyze-batch`);

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${HF_TOKEN}`
    };

    // Forward the request to Hugging Face
    const hfResponse = await fetch(`${HF_SPACE_URL}/analyze-batch`, {
      method: 'POST',
      headers: headers,
      body: request.body
    });

    console.log(`[Edge Function] HF Response: ${hfResponse.status}`);

    if (!hfResponse.ok) {
      const errorText = await hfResponse.text();
      console.error(`[Edge Function] HF Error:`, errorText.substring(0, 500));
      return new Response(JSON.stringify({ 
        error: 'Face service error', 
        details: errorText.substring(0, 1000)
      }), {
        status: hfResponse.status,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Return the response
    const data = await hfResponse.arrayBuffer();
    const contentType = hfResponse.headers.get('content-type') || 'application/json';

    return new Response(data, {
      status: 200,
      headers: { 
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    console.error(`[Edge Function] Error:`, error);
    return new Response(JSON.stringify({ 
      error: 'Proxy error', 
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
