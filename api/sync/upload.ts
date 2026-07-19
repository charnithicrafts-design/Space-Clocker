import { handleUpload } from '@vercel/blob/client';


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
    let parsedBody = req.body;
    if (typeof req.body === 'string') {
      parsedBody = JSON.parse(req.body);
    } else if (Buffer.isBuffer(req.body)) {
      parsedBody = JSON.parse(req.body.toString('utf-8'));
    }

    if (!parsedBody || typeof parsedBody !== 'object') {
      res.status(400).send('Invalid request body. Expected JSON object.');
      return;
    }

    console.log('[Upload Diagnostic] req.url:', req.url);
    console.log('[Upload Diagnostic] req.headers.host:', req.headers.host);
    console.log('[Upload Diagnostic] req.headers.x-forwarded-proto:', req.headers['x-forwarded-proto']);

    const jsonResponse = await handleUpload({
      body: parsedBody,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        return {
          allowedContentTypes: ['application/octet-stream'],
          tokenPayload: JSON.stringify({ clientId }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log('Upload completed:', blob.url);
      },
    });

    res.status(200).json(jsonResponse);
  } catch (error: any) {
    console.error('Vercel Blob Sync Error:', error);
    res.status(500).send(`Vercel Blob Sync Error: ${error.message}`);
  }
}
