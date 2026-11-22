import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  THEMES,
  getStoredTheme,
  setAppTheme,
  applyThemeToDocument,
  getStoredColorMode,
  applyColorModeToDocument,
  setColorMode,
  toggleColorMode,
  AppTheme
} from './theme';
import { useTrackStore } from '../store/useTrackStore';

describe('theme utility', () => {
  let localStorageMock: Record<string, string> = {};

  beforeEach(() => {
    localStorageMock = {};
    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key: string) => localStorageMock[key] ?? null),
      setItem: vi.fn((key: string, value: string) => {
        localStorageMock[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete localStorageMock[key];
      }),
      clear: vi.fn(() => {
        localStorageMock = {};
      }),
    });

    document.body.dataset.theme = '';
    document.body.dataset.colorMode = '';
  });

  it('defines all 3 themes with proper colors and metadata', () => {
    expect(THEMES.cosmos).toBeDefined();
    expect(THEMES.astronaut).toBeDefined();
    expect(THEMES['sunny-iris']).toBeDefined();

    expect(THEMES.cosmos.colors.primary).toBe('#00F2FF');
    expect(THEMES.astronaut.colors.primary).toBe('#1D6291');
    expect(THEMES['sunny-iris'].colors.primary).toBe('#DDB763');
  });

  it('returns cosmos as default when nothing is stored', () => {
    expect(getStoredTheme()).toBe('cosmos');
  });

  it('reads valid stored themes from localStorage', () => {
    localStorageMock['spaceclocker_theme'] = 'astronaut';
    expect(getStoredTheme()).toBe('astronaut');

    localStorageMock['spaceclocker_theme'] = 'sunny-iris';
    expect(getStoredTheme()).toBe('sunny-iris');
  });

  it('falls back to cosmos on invalid stored value', () => {
    localStorageMock['spaceclocker_theme'] = 'invalid-theme';
    expect(getStoredTheme()).toBe('cosmos');
  });

  it('applies theme to document body dataset', () => {
    applyThemeToDocument('astronaut');
    expect(document.body.dataset.theme).toBe('astronaut');

    applyThemeToDocument('sunny-iris');
    expect(document.body.dataset.theme).toBe('sunny-iris');
  });

  it('persists theme via setAppTheme and updates store and body', () => {
    const mockUpdatePreferences = vi.fn();
    useTrackStore.setState({
      updatePreferences: mockUpdatePreferences
    } as any);

    setAppTheme('sunny-iris');
    expect(localStorage.getItem('spaceclocker_theme')).toBe('sunny-iris');
    expect(document.body.dataset.theme).toBe('sunny-iris');
    expect(mockUpdatePreferences).toHaveBeenCalledWith({ theme: 'sunny-iris' });
  });

  it('returns dark as default color mode when nothing is stored', () => {
    expect(getStoredColorMode()).toBe('dark');
  });

  it('reads valid stored color mode from localStorage', () => {
    localStorageMock['spaceclocker_color_mode'] = 'light';
    expect(getStoredColorMode()).toBe('light');

    localStorageMock['spaceclocker_color_mode'] = 'dark';
    expect(getStoredColorMode()).toBe('dark');
  });

  it('applies color mode to document body dataset', () => {
    applyColorModeToDocument('light');
    expect(document.body.dataset.colorMode).toBe('light');

    applyColorModeToDocument('dark');
    expect(document.body.dataset.colorMode).toBe('dark');
  });

  it('persists color mode via setColorMode and updates store and body', () => {
    const mockUpdatePreferences = vi.fn();
    useTrackStore.setState({
      updatePreferences: mockUpdatePreferences
    } as any);

    setColorMode('light');
    expect(localStorage.getItem('spaceclocker_color_mode')).toBe('light');
    expect(document.body.dataset.colorMode).toBe('light');
    expect(mockUpdatePreferences).toHaveBeenCalledWith({ colorMode: 'light' });
  });

  it('toggles color mode between dark and light', () => {
    const mockUpdatePreferences = vi.fn();
    useTrackStore.setState({
      updatePreferences: mockUpdatePreferences
    } as any);

    expect(getStoredColorMode()).toBe('dark');
    toggleColorMode();
    expect(localStorage.getItem('spaceclocker_color_mode')).toBe('light');
    expect(document.body.dataset.colorMode).toBe('light');

    toggleColorMode();
    expect(localStorage.getItem('spaceclocker_color_mode')).toBe('dark');
    expect(document.body.dataset.colorMode).toBe('dark');
  });
});
