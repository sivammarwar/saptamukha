import type { VercelRequest, VercelResponse } from '@vercel/node';

const HF_SPACE_URL = 'https://sivamarwar-saptamukha.hf.space';
const HF_TOKEN = process.env.HF_TOKEN;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-Key, Authorization');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${HF_TOKEN}`
    };

    const hfResponse = await fetch(`${HF_SPACE_URL}/analyze`, {
      method: 'POST',
      headers: headers,
      body: req.body as any
    });

    if (!hfResponse.ok) {
      const errorText = await hfResponse.text();
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.status(hfResponse.status).json({
        error: 'Face service error',
        details: errorText.substring(0, 1000)
      });
    }

    const data = await hfResponse.arrayBuffer();
    const contentType = hfResponse.headers.get('content-type') || 'application/json';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).send(Buffer.from(data));

  } catch (error) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(500).json({
      error: 'Proxy error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
