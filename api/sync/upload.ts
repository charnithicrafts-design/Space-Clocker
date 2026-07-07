import { put } from '@vercel/blob';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get('clientId');
  
  if (!clientId || clientId.length < 5) {
    return new Response('Invalid or missing clientId', { status: 400 });
  }

  try {
    const filename = `space-clocker-${clientId}.pgdump`;
    
    const blob = await put(filename, request.body!, { 
      access: 'public',
      addRandomSuffix: false // Overwrite the same sync file to save space
    });

    return new Response(JSON.stringify(blob), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
