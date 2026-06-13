export const runtime = 'edge';

const HF_SPACE_URL = 'https://sivamarwar-saptamukha.hf.space';
const HF_TOKEN = process.env.HF_TOKEN;

export async function POST(request) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${HF_SPACE_URL}/embed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HF_TOKEN}`
      },
      body: JSON.stringify(body)
    });
    
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
