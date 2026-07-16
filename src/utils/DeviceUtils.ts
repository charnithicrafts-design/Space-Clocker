/**
 * Device identification and User-Agent parsing utilities
 * to support multi-device cloud synchronization.
 */

export interface DeviceInfo {
  id: string;
  name: string;
  type: 'mobile' | 'desktop' | 'tablet' | 'unknown';
}

/**
 * Retrieves or generates a unique, persistent Device ID for the current browser session.
 */
export function getOrCreateDeviceId(): string {
  if (typeof window === 'undefined') return 'unknown-device';
  
  let deviceId = localStorage.getItem('space_clocker_device_id');
  if (!deviceId) {
    deviceId = `dev-${Math.random().toString(36).substring(2, 10)}-${Date.now().toString(36)}`;
    localStorage.setItem('space_clocker_device_id', deviceId);
  }
  return deviceId;
}

/**
 * Parses user agent to detect the device name and type.
 */
export function getDeviceInfo(): DeviceInfo {
  const id = getOrCreateDeviceId();
  if (typeof window === 'undefined') {
    return { id, name: 'Server Environment', type: 'unknown' };
  }

  const ua = navigator.userAgent;
  let type: 'mobile' | 'desktop' | 'tablet' | 'unknown' = 'desktop';
  let name = 'Web Browser';

  // 1. Detect Device Type
  const isTablet = /(ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua);
  const isMobile = /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Opera Mini/i.test(ua);

  if (isTablet) {
    type = 'tablet';
  } else if (isMobile) {
    type = 'mobile';
  } else {
    type = 'desktop';
  }

  // 2. Build Human-Readable Device Name
  if (/macintosh|mac os x/i.test(ua)) {
    if (isTablet || isMobile) {
      name = 'iPad';
    } else {
      name = 'MacBook';
    }
  } else if (/windows/i.test(ua)) {
    if (/touch/i.test(ua)) {
      name = 'Surface Tablet';
    } else {
      name = 'Windows PC';
    }
  } else if (/android/i.test(ua)) {
    if (isTablet) {
      name = 'Android Tablet';
    } else {
      // Common Android vendors
      if (/samsung|sm-/i.test(ua)) {
        name = 'Samsung Phone';
      } else if (/pixel/i.test(ua)) {
        name = 'Google Pixel';
      } else if (/oneplus/i.test(ua)) {
        name = 'OnePlus Phone';
      } else {
        name = 'Android Phone';
      }
    }
  } else if (/iphone/i.test(ua)) {
    name = 'iPhone';
  } else if (/linux/i.test(ua)) {
    name = 'Linux Workstation';
  }

  return { id, name, type };
}
