import { put } from '@vercel/blob';

export const config = {
  api: {
    bodyParser: false, // We need the raw stream for put()
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
    // We stream the request directly to Vercel Blob
    const blob = await put(`space-clocker-${clientId}.bin`, req, {
      access: 'private',
      contentType: 'application/octet-stream',
      addRandomSuffix: false, // Overwrite the same file to save space
    });

    res.status(200).json(blob);
  } catch (error: any) {
    console.error('Vercel Blob Server Upload Error:', error);
    res.status(500).send(`Vercel Blob Server Upload Error: ${error.message}`);
  }
}
