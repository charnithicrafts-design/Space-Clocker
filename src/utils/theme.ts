import { useTrackStore } from '../store/useTrackStore';

export type AppTheme = 'cosmos' | 'astronaut' | 'sunny-iris';
export type ColorMode = 'dark' | 'light';

export interface ThemeMeta {
  id: AppTheme;
  name: string;
  badge: string;
  subtitle: string;
  description: string;
  purpose: string;
  colors: {
    primary: string;
    secondary: string;
    tertiary: string;
    bg: string;
    border: string;
  };
}

export const THEMES: Record<AppTheme, ThemeMeta> = {
  cosmos: {
    id: 'cosmos',
    name: 'Cosmos (Original)',
    badge: 'Interstellar HUD',
    subtitle: 'Deep Obsidian & Electric Cyan',
    description: 'High-contrast futuristic cockpit telemetry with electric cyan rays and cosmic nebula violet.',
    purpose: 'Designed for deep focus, adrenaline, and high-octane motivation in dark environments.',
    colors: {
      primary: '#00F2FF',
      secondary: '#DAB9FF',
      tertiary: '#43F3DE',
      bg: '#0B0E14',
      border: '#2D3844'
    }
  },
  astronaut: {
    id: 'astronaut',
    name: 'Astronaut (Aerospace)',
    badge: 'NASA Technical HUD',
    subtitle: 'Spacesuit Ceramic & Earth Orbital Blue',
    description: 'Authentic flight instrument styling with space vacuum black, thermal foil gold, and orbital ocean blue.',
    purpose: 'Grounded engineering precision inspired by Apollo and Artemis missions for disciplined, tactical execution.',
    colors: {
      primary: '#1D6291',
      secondary: '#A0947E',
      tertiary: '#718FA7',
      bg: '#090807',
      border: '#1D6291'
    }
  },
  'sunny-iris': {
    id: 'sunny-iris',
    name: 'Sunny Iris (Ease of Eye)',
    badge: 'Botanical Equilibrium & Launch Heritage',
    subtitle: 'Cosmic Royal Purple & Sunny Gold',
    description: 'Restorative botanical pastel palette inspired by wild spring irises and the Charnithi launch poster.',
    purpose: 'Zero eye fatigue for marathon sessions, wrapping your goals in calming lavender, golden sun, and sprout green.',
    colors: {
      primary: '#DDB763',
      secondary: '#D6C7F2',
      tertiary: '#A2B960',
      bg: '#140726',
      border: '#491F75'
    }
  }
};

const THEME_STORAGE_KEY = 'spaceclocker_theme';
const COLOR_MODE_STORAGE_KEY = 'spaceclocker_color_mode';

export const getStoredColorMode = (): ColorMode => {
  if (typeof localStorage !== 'undefined' && localStorage && typeof localStorage.getItem === 'function') {
    try {
      const stored = localStorage.getItem(COLOR_MODE_STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
    } catch {
      // Fallback on restricted localStorage
    }
  }
  return 'dark';
};

export const applyColorModeToDocument = (mode: ColorMode): void => {
  if (typeof document !== 'undefined' && document.body) {
    document.body.dataset.colorMode = mode;
  }
};

export const setColorMode = (newMode: ColorMode): void => {
  if (typeof localStorage !== 'undefined' && localStorage && typeof localStorage.setItem === 'function') {
    try {
      localStorage.setItem(COLOR_MODE_STORAGE_KEY, newMode);
    } catch {
      // Ignore quota/security errors
    }
  }
  applyColorModeToDocument(newMode);

  // Sync with Zustand store
  const store = useTrackStore.getState();
  if (store.updatePreferences) {
    store.updatePreferences({ colorMode: newMode });
  }
};

export const toggleColorMode = (): void => {
  const current = getStoredColorMode();
  setColorMode(current === 'light' ? 'dark' : 'light');
};

export const getStoredTheme = (): AppTheme => {
  if (typeof localStorage !== 'undefined' && localStorage && typeof localStorage.getItem === 'function') {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'cosmos' || stored === 'astronaut' || stored === 'sunny-iris') {
        return stored;
      }
    } catch {
      // Fallback on restricted localStorage
    }
  }
  return 'cosmos';
};

export const applyThemeToDocument = (theme: AppTheme): void => {
  if (typeof document !== 'undefined' && document.body) {
    document.body.dataset.theme = theme;
  }
};

export const setAppTheme = (newTheme: AppTheme): void => {
  if (typeof localStorage !== 'undefined' && localStorage && typeof localStorage.setItem === 'function') {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch {
      // Ignore quota/security errors
    }
  }
  applyThemeToDocument(newTheme);

  // Sync with Zustand store
  const store = useTrackStore.getState();
  if (store.updatePreferences) {
    store.updatePreferences({ theme: newTheme });
  }
};

export const useTheme = () => {
  const preferences = useTrackStore((state) => state.preferences);
  const theme: AppTheme = preferences?.theme || 'cosmos';
  const colorMode: ColorMode = preferences?.colorMode || 'dark';

  return {
    theme,
    colorMode,
    isLightMode: colorMode === 'light',
    meta: THEMES[theme],
    setTheme: setAppTheme,
    setColorMode,
    toggleColorMode,
    allThemes: Object.values(THEMES)
  };
};
