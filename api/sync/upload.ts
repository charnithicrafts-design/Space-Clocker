import { put } from '@vercel/blob';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const { clientId } = req.query;
  
  if (!clientId || clientId.length < 5) {
    res.status(400).send('Invalid or missing clientId');
    return;
  }

  try {
    const filename = `space-clocker-${clientId}.pgdump`;
    
    // Pass the raw request stream directly as the body (bodyParser is disabled)
    const blob = await put(filename, req, { 
      access: 'public',
      addRandomSuffix: false // Overwrite the same sync file to save space
    });

    res.status(200).json(blob);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
