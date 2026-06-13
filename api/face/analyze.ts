export const config = {
  runtime: 'edge',
};

const HF_SPACE_URL = 'https://sivamarwar-saptamukha.hf.space';
const HF_TOKEN = process.env.HF_TOKEN;

export default async function handler(request: Request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-API-Key, Authorization'
      }
    });
  }

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
    const incomingApiKey = request.headers.get('x-api-key') || process.env.EMBED_API_KEY || '';
    const incomingContentType = request.headers.get('content-type') || '';
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${HF_TOKEN}`
    };
    if (incomingApiKey) headers['X-API-Key'] = incomingApiKey;
    if (incomingContentType) headers['Content-Type'] = incomingContentType;

    const hfResponse = await fetch(`${HF_SPACE_URL}/analyze`, {
      method: 'POST',
      headers: headers,
      body: request.body
    });

    if (!hfResponse.ok) {
      const errorText = await hfResponse.text();
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
