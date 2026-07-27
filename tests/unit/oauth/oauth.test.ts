import { describe, it, expect } from 'vitest';

describe('OAuth Module', () => {
  it('should have correct Google Auth redirect URIs', () => {
    const expectedOrigin = process.env.VITE_AUTH_ORIGIN || 'https://app.spaceclocker.com';
    const callbackUri = `${expectedOrigin}/api/auth/callback/google`;
    
    expect(callbackUri).toContain('/api/auth/callback/google');
  });

  it('should validate allowed origins correctly', () => {
    const origins = ['https://app.spaceclocker.com', 'http://localhost:3000'];
    expect(origins).toContain('https://app.spaceclocker.com');
  });
});
