export const config = {
  api: {
    responseLimit: false, // Prevent Vercel from cutting off the stream
  },
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const { url } = req.query;
  if (!url || typeof url !== 'string') {
    res.status(400).send('Missing url parameter');
    return;
  }

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Upstream returned ${response.status} ${response.statusText}`);
    }

    // Set appropriate headers
    res.status(200);
    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/octet-stream');

    // Transfer the blob data
    const arrayBuffer = await response.arrayBuffer();
    res.send(Buffer.from(arrayBuffer));
  } catch (error: any) {
    console.error('Vercel Blob Server Download Error:', error);
    res.status(500).send(`Vercel Blob Server Download Error: ${error.message}`);
  }
}
