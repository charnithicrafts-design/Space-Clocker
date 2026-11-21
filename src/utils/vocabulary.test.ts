import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useVocabulary, VOCABULARY_DICTIONARY, getStoredVocabularyMode } from './vocabulary';
import { useTrackStore } from '../store/useTrackStore';

vi.mock('../store/useTrackStore', () => ({
  useTrackStore: vi.fn()
}));

describe('vocabulary utility and useVocabulary hook', () => {
  let mockUpdatePreferences: any;
  let mockStorage: Record<string, string> = {};

  beforeEach(() => {
    vi.clearAllMocks();
    mockStorage = {};
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => mockStorage[key] ?? null,
      setItem: (key: string, val: string) => { mockStorage[key] = val; },
      removeItem: (key: string) => { delete mockStorage[key]; },
      clear: () => { mockStorage = {}; }
    });
    mockUpdatePreferences = vi.fn();
    (useTrackStore as any).mockReturnValue({
      preferences: {
        confirmDelete: true,
        uiMode: 'simple',
        vocabularyMode: 'original'
      },
      updatePreferences: mockUpdatePreferences
    });
  });

  it('has exact parity of keys between original and people dictionaries', () => {
    const originalKeys = Object.keys(VOCABULARY_DICTIONARY.original).sort();
    const peopleKeys = Object.keys(VOCABULARY_DICTIONARY.people).sort();

    expect(originalKeys).toEqual(peopleKeys);
  });

  it('defaults to original mode when preference is original', () => {
    const { result } = renderHook(() => useVocabulary());

    expect(result.current.mode).toBe('original');
    expect(result.current.isOriginalMode).toBe(true);
    expect(result.current.isPeopleMode).toBe(false);
    expect(result.current.t('nebulaTitle')).toBe('Nebula Architect');
    expect(result.current.t('orbitTitle')).toBe('Orbit Scheduler');
    expect(result.current.t('voidProtocolTitle')).toBe('The Void Protocol');
  });

  it('translates terms accurately in people mode', () => {
    (useTrackStore as any).mockReturnValue({
      preferences: {
        confirmDelete: true,
        uiMode: 'simple',
        vocabularyMode: 'people'
      },
      updatePreferences: mockUpdatePreferences
    });

    const { result } = renderHook(() => useVocabulary());

    expect(result.current.mode).toBe('people');
    expect(result.current.isPeopleMode).toBe(true);
    expect(result.current.isOriginalMode).toBe(false);
    expect(result.current.t('nebulaTitle')).toBe('Goals & Ambitions');
    expect(result.current.t('orbitTitle')).toBe('Daily To-Do List');
    expect(result.current.t('voidProtocolTitle')).toBe('Habits to Avoid');
    expect(result.current.t('neuralLinkTitle')).toBe('Cloud Backup & Sync');
  });

  it('updates preferences and localStorage when setVocabularyMode is called', () => {
    const { result } = renderHook(() => useVocabulary());

    act(() => {
      result.current.setVocabularyMode('people');
    });

    expect(localStorage.getItem('spaceclocker_vocabulary_mode')).toBe('people');
    expect(mockUpdatePreferences).toHaveBeenCalledWith({ vocabularyMode: 'people' });
  });

  it('toggles vocabulary mode cleanly between original and people', () => {
    const { result } = renderHook(() => useVocabulary());

    act(() => {
      result.current.toggleVocabularyMode();
    });

    expect(mockUpdatePreferences).toHaveBeenCalledWith({ vocabularyMode: 'people' });
  });

  it('reads stored preference from localStorage via getStoredVocabularyMode', () => {
    expect(getStoredVocabularyMode()).toBe('original');

    localStorage.setItem('spaceclocker_vocabulary_mode', 'people');
    expect(getStoredVocabularyMode()).toBe('people');

    localStorage.setItem('spaceclocker_vocabulary_mode', 'invalid');
    expect(getStoredVocabularyMode()).toBe('original');
  });
});
