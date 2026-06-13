export const runtime = 'edge';

const HF_SPACE_URL = 'https://sivamarwar-saptamukha.hf.space';
const HF_TOKEN = process.env.HF_TOKEN;

// Handle GET requests - return a simple status check
export async function GET(request, { params }) {
  return new Response(JSON.stringify({ 
    status: 'ok', 
    message: 'Face API proxy is running. Use POST for requests.',
    timestamp: new Date().toISOString()
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function POST(request, { params }) {
  return handleRequest(request, params);
}

async function handleRequest(request, params) {
  try {
    const path = params.path?.join('/') || '';
    const targetUrl = `${HF_SPACE_URL}/${path}`;
    
    const headers = {
      'Authorization': `Bearer ${HF_TOKEN}`
    };
    
    if (request.body) {
      headers['Content-Type'] = 'application/json';
    }
    
    const fetchOptions = {
      method: request.method,
      headers: headers
    };
    
    // Handle multipart form data (file uploads) vs JSON
    const contentType = request.headers.get('content-type') || '';
    if (request.body) {
      if (contentType.includes('multipart/form-data')) {
        // For file uploads, pass the body as-is (it's already FormData)
        fetchOptions.body = request.body;
        // Don't set Content-Type - browser will set it with boundary
        delete headers['Content-Type'];
      } else {
        // For JSON/text, read as text
        fetchOptions.body = await request.text();
      }
    }
    
    const response = await fetch(targetUrl, fetchOptions);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HF Space error: ${response.status} ${response.statusText}`, {
        url: targetUrl,
        status: response.status,
        error: errorText.substring(0, 500)
      });
      return new Response(JSON.stringify({ 
        error: 'Face service error', 
        status: response.status,
        details: errorText.substring(0, 1000)
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Proxy error', message: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
