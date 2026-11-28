import { put, list } from '@vercel/blob';
import * as Y from 'yjs';

export const config = {
  api: {
    bodyParser: false, // We need the raw stream for put()
  },
};

function isGzip(bytes: Uint8Array): boolean {
  return bytes.length >= 2 && bytes[0] === 0x1f && bytes[1] === 0x8b;
}

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
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    const incomingBuffer = Buffer.concat(chunks);
    const incomingBytes = new Uint8Array(incomingBuffer);
    const blobKey = `space-clocker-${clientId}.bin`;

    let finalBuffer: Buffer = incomingBuffer;

    // Server-side CRDT merge: if an existing Y.js blob exists, merge concurrent updates safely
    if (!isGzip(incomingBytes)) {
      try {
        const { blobs } = await list({ prefix: blobKey, limit: 1 });
        if (blobs.length > 0 && process.env.BLOB_READ_WRITE_TOKEN) {
          const existingRes = await fetch(blobs[0].url, {
            headers: {
              Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
            },
          });
          if (existingRes.ok) {
            const existingBytes = new Uint8Array(await existingRes.arrayBuffer());
            if (!isGzip(existingBytes) && existingBytes.length > 0) {
              const merged = Y.mergeUpdates([existingBytes, incomingBytes]);
              finalBuffer = Buffer.from(merged);
            }
          }
        }
      } catch (mergeErr) {
        // Non-fatal: proceed with incoming update if list/fetch fails
        console.warn('Server-side Y.mergeUpdates skipped:', mergeErr);
      }
    }

    const blob = await put(blobKey, finalBuffer, {
      access: 'private',
      contentType: 'application/octet-stream',
      addRandomSuffix: false,
      allowOverwrite: true,
    });

    res.status(200).json(blob);
  } catch (error: any) {
    console.error('Vercel Blob Server Upload Error:', error);
    res.status(500).send(`Vercel Blob Server Upload Error: ${error.message}`);
  }
}
