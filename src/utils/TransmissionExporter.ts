import { Transmission } from '../store/useTrackStore';

/**
 * Encodes a transmission object into a base64 string for sharing.
 * In a real-world scenario, you might want to compress or encrypt this.
 */
export function generateShareLink(transmission: Transmission): string {
  const json = JSON.stringify(transmission);
  const hash = btoa(encodeURIComponent(json));
  // Use the origin or default to a standard URL
  const base = typeof window !== 'undefined' ? window.location.origin : 'https://space-clocker.app';
  return `${base}/transmission/share#${hash}`;
}

/**
 * Decodes a base64 string back into a Transmission object.
 */
export function parseShareLink(hash: string): Transmission {
  try {
    const json = decodeURIComponent(atob(hash));
    const data = JSON.parse(json);
    
    // Basic validation
    if (!data.id || !data.tier || !data.title) {
      throw new Error('Invalid transmission data');
    }
    
    return data as Transmission;
  } catch (e) {
    throw new Error('CORRUPT_SIGNAL: Unable to decrypt transmission uplink.');
  }
}
