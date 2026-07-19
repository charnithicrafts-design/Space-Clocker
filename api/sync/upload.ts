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
    // Read the raw stream into a Buffer so we can retry if the access level mismatches
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    const fileBuffer = Buffer.concat(chunks);

    const blob = await put(`space-clocker-${clientId}.bin`, fileBuffer, {
      access: 'private',
      contentType: 'application/octet-stream',
      addRandomSuffix: false,
    });

    res.status(200).json(blob);
  } catch (error: any) {
    console.error('Vercel Blob Server Upload Error:', error);
    res.status(500).send(`Vercel Blob Server Upload Error: ${error.message}`);
  }
}
