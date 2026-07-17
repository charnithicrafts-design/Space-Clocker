import { list } from '@vercel/blob';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const { clientId } = req.query;
  
  if (!clientId || clientId.length < 5) {
    res.status(400).send('Invalid or missing clientId');
    return;
  }

  try {
    const prefix = `space-clocker-${clientId}.pgdump`;
    
    // list only matching blobs
    const { blobs } = await list({ prefix, limit: 1 });
    
    if (blobs.length === 0) {
      res.status(200).json({ found: false });
      return;
    }

    res.status(200).json({ 
      found: true,
      url: blobs[0].url,
      modifiedAt: blobs[0].uploadedAt
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
