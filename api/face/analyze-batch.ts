export const config = {
  runtime: 'edge',
};

const HF_SPACE_URL = 'https://sivamarwar-saptamukha.hf.space';
const HF_TOKEN = process.env.HF_TOKEN;

export default async function handler(request: Request) {
  const traceId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const tokenPresent = Boolean(HF_TOKEN);
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
        'Access-Control-Allow-Origin': '*',
        'x-saptamukha-trace-id': traceId
      }
    });
  }

  try {
    // #region debug-point A:request-entry
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${HF_TOKEN}`
    };
    // #endregion

    // Forward the request to Hugging Face
    const hfResponse = await fetch(`${HF_SPACE_URL}/analyze-batch`, {
      method: 'POST',
      headers: headers,
      body: request.body
    });

    if (!hfResponse.ok) {
      const errorText = await hfResponse.text();
      return new Response(JSON.stringify({ 
        error: 'Face service error', 
        details: errorText.substring(0, 1000),
        debug: {
          traceId,
          upstreamStatus: hfResponse.status,
          tokenPresent
        }
      }), {
        status: hfResponse.status,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'x-saptamukha-trace-id': traceId,
          'x-saptamukha-hf-token': tokenPresent ? 'present' : 'missing'
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
        'Access-Control-Allow-Origin': '*',
        'x-saptamukha-trace-id': traceId,
        'x-saptamukha-hf-token': tokenPresent ? 'present' : 'missing'
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Proxy error', 
      message: error instanceof Error ? error.message : 'Unknown error',
      debug: {
        traceId,
        tokenPresent
      }
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'x-saptamukha-trace-id': traceId,
        'x-saptamukha-hf-token': tokenPresent ? 'present' : 'missing'
      }
    });
  }
}
