export const runtime = 'edge';

const HF_SPACE_URL = 'https://sivamarwar-saptamukha.hf.space';
const HF_TOKEN = process.env.HF_TOKEN;

export async function GET(request) {
  return new Response(JSON.stringify({ 
    status: 'ok', 
    message: 'Face analyze endpoint is running. Use POST for analysis requests.',
    timestamp: new Date().toISOString()
  }), {
    status: 200,
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

export async function POST(request) {
  try {
    console.log(`[Edge Function] POST /analyze -> ${HF_SPACE_URL}/analyze`);
    
    // Build headers
    const headers = new Headers();
    headers.set('Authorization', `Bearer ${HF_TOKEN}`);
    
    const fetchOptions = {
      method: 'POST',
      headers: headers
    };
    
    // Handle request body
    const contentType = request.headers.get('content-type') || '';
    console.log(`[Edge Function] Content-Type: ${contentType}`);
    
    if (request.body) {
      if (contentType.includes('multipart/form-data')) {
        // For file uploads, pass the body as-is
        fetchOptions.body = request.body;
        // Don't set Content-Type - fetch will set it with the boundary
        fetchOptions.duplex = 'half';
        console.log(`[Edge Function] Passing multipart body as-is`);
      } else if (contentType.includes('application/json')) {
        // For JSON, clone the body
        fetchOptions.body = await request.text();
        headers.set('Content-Type', contentType);
        console.log(`[Edge Function] Passing JSON body`);
      } else {
        // For other types, read as blob
        fetchOptions.body = await request.blob();
        headers.set('Content-Type', contentType);
        console.log(`[Edge Function] Passing blob body`);
      }
    }
    
    console.log(`[Edge Function] Forwarding to: ${HF_SPACE_URL}/analyze`);
    
    const response = await fetch(`${HF_SPACE_URL}/analyze`, fetchOptions);
    
    console.log(`[Edge Function] Response: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Edge Function] HF Space error:`, {
        status: response.status,
        statusText: response.statusText,
        error: errorText.substring(0, 500)
      });
      return new Response(JSON.stringify({ 
        error: 'Face service error', 
        status: response.status,
        details: errorText.substring(0, 1000)
      }), {
        status: response.status,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
    
    // Get the response data
    const responseData = await response.arrayBuffer();
    
    // Get the content type from the response
    const responseContentType = response.headers.get('content-type') || 'application/json';
    
    return new Response(responseData, {
      status: 200,
      headers: { 
        'Content-Type': responseContentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-API-Key, Authorization'
      }
    });
    
  } catch (error) {
    console.error(`[Edge Function] Proxy error:`, error);
    return new Response(JSON.stringify({ 
      error: 'Proxy error', 
      message: error.message,
      stack: error.stack
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

export async function OPTIONS(request) {
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
