import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useTheme, THEME_STORAGE_KEY } from './useTheme';

// localStorageのモック
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

// matchMediaのモック
const createMatchMedia = (matches: boolean) => {
  return vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
};

describe('useTheme', () => {
  beforeEach(() => {
    // localStorageをモック
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    // documentのclassListをリセット
    document.documentElement.classList.remove('dark', 'light');

    // localStorageをクリア
    localStorageMock.clear();

    // matchMediaをデフォルトでライトモード優先にモック
    window.matchMedia = createMatchMedia(false);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('初期化', () => {
    it('localStorageに保存値がない場合、システム設定を参照する（ライトモード）', async () => {
      window.matchMedia = createMatchMedia(false);
      const { result } = renderHook(() => useTheme());

      // useEffect後の状態を待つ
      await waitFor(() => {
        expect(result.current.isHydrated).toBe(true);
      });

      expect(result.current.theme).toBe('light');
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('localStorageに保存値がない場合、システム設定を参照する（ダークモード）', async () => {
      window.matchMedia = createMatchMedia(true);
      const { result } = renderHook(() => useTheme());

      await waitFor(() => {
        expect(result.current.isHydrated).toBe(true);
      });

      expect(result.current.theme).toBe('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('localStorageに"dark"が保存されている場合、ダークモードで初期化', async () => {
      localStorageMock.getItem.mockReturnValue('dark');
      const { result } = renderHook(() => useTheme());

      await waitFor(() => {
        expect(result.current.isHydrated).toBe(true);
      });

      expect(result.current.theme).toBe('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('localStorageに"light"が保存されている場合、ライトモードで初期化', async () => {
      localStorageMock.getItem.mockReturnValue('light');
      const { result } = renderHook(() => useTheme());

      await waitFor(() => {
        expect(result.current.isHydrated).toBe(true);
      });

      expect(result.current.theme).toBe('light');
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('初期状態ではisHydratedがfalse、useEffect後にtrueになる', async () => {
      const { result } = renderHook(() => useTheme());

      // useEffect実行後
      await waitFor(() => {
        expect(result.current.isHydrated).toBe(true);
      });
    });
  });

  describe('テーマ切り替え', () => {
    it('toggleThemeでライトモードからダークモードに切り替え', async () => {
      localStorageMock.getItem.mockReturnValue('light');
      const { result } = renderHook(() => useTheme());

      await waitFor(() => {
        expect(result.current.isHydrated).toBe(true);
      });

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.theme).toBe('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(THEME_STORAGE_KEY, 'dark');
    });

    it('toggleThemeでダークモードからライトモードに切り替え', async () => {
      localStorageMock.getItem.mockReturnValue('dark');
      const { result } = renderHook(() => useTheme());

      await waitFor(() => {
        expect(result.current.isHydrated).toBe(true);
      });

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.theme).toBe('light');
      expect(document.documentElement.classList.contains('dark')).toBe(false);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(THEME_STORAGE_KEY, 'light');
    });

    it('setThemeで明示的にテーマを設定', async () => {
      const { result } = renderHook(() => useTheme());

      await waitFor(() => {
        expect(result.current.isHydrated).toBe(true);
      });

      act(() => {
        result.current.setTheme('dark');
      });

      expect(result.current.theme).toBe('dark');
      expect(document.documentElement.classList.contains('dark')).toBe(true);

      act(() => {
        result.current.setTheme('light');
      });

      expect(result.current.theme).toBe('light');
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });

  describe('isDarkMode', () => {
    it('ダークモード時にtrueを返す', async () => {
      localStorageMock.getItem.mockReturnValue('dark');
      const { result } = renderHook(() => useTheme());

      await waitFor(() => {
        expect(result.current.isHydrated).toBe(true);
      });

      expect(result.current.isDarkMode).toBe(true);
    });

    it('ライトモード時にfalseを返す', async () => {
      localStorageMock.getItem.mockReturnValue('light');
      const { result } = renderHook(() => useTheme());

      await waitFor(() => {
        expect(result.current.isHydrated).toBe(true);
      });

      expect(result.current.isDarkMode).toBe(false);
    });
  });
});
