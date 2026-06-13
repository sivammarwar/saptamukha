export const runtime = 'edge';

const HF_SPACE_URL = 'https://sivamarwar-saptamukha.hf.space';
const HF_TOKEN = process.env.HF_TOKEN;

export async function GET(request, { params }) {
  return handleRequest(request, params);
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
    
    if (request.body) {
      fetchOptions.body = await request.text();
    }
    
    const response = await fetch(targetUrl, fetchOptions);
    
    if (!response.ok) {
      const error = await response.text();
      return new Response(JSON.stringify({ error: 'Face service error', details: error }), {
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
