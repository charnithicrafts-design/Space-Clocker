import { list } from '@vercel/blob';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get('clientId');
  
  if (!clientId || clientId.length < 5) {
    return new Response('Invalid or missing clientId', { status: 400 });
  }

  try {
    const prefix = `space-clocker-${clientId}.pgdump`;
    
    // list only matching blobs
    const { blobs } = await list({ prefix, limit: 1 });
    
    if (blobs.length === 0) {
      return new Response(JSON.stringify({ found: false }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ 
      found: true,
      url: blobs[0].url,
      modifiedAt: blobs[0].uploadedAt
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
