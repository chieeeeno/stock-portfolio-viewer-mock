import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from './ThemeToggle';

// useThemeフックをモック
vi.mock('@/app/_hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

import { useTheme } from '@/app/_hooks/useTheme';

// localStorageのモック
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

describe('ThemeToggle', () => {
  const mockToggleTheme = vi.fn();

  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('描画', () => {
    it('ライトモード時に月アイコン（ダークモードへの切り替え）を表示', () => {
      vi.mocked(useTheme).mockReturnValue({
        theme: 'light',
        isDarkMode: false,
        toggleTheme: mockToggleTheme,
        setTheme: vi.fn(),
        isHydrated: true,
      });

      render(<ThemeToggle />);

      const button = screen.getByRole('button', { name: /ダークモードに切り替え/i });
      expect(button).toBeInTheDocument();

      // 月アイコンが表示されている（data-testid使用）
      expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
    });

    it('ダークモード時に太陽アイコン（ライトモードへの切り替え）を表示', () => {
      vi.mocked(useTheme).mockReturnValue({
        theme: 'dark',
        isDarkMode: true,
        toggleTheme: mockToggleTheme,
        setTheme: vi.fn(),
        isHydrated: true,
      });

      render(<ThemeToggle />);

      const button = screen.getByRole('button', { name: /ライトモードに切り替え/i });
      expect(button).toBeInTheDocument();

      // 太陽アイコンが表示されている（data-testid使用）
      expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
    });

    it('ハイドレーション中は月アイコン（ライトモード）を表示', () => {
      vi.mocked(useTheme).mockReturnValue({
        theme: 'dark',
        isDarkMode: true,
        toggleTheme: mockToggleTheme,
        setTheme: vi.fn(),
        isHydrated: false,
      });

      render(<ThemeToggle />);

      // ハイドレーション中はダークモードでも月アイコン（SSRと一致）
      const button = screen.getByRole('button', { name: /ダークモードに切り替え/i });
      expect(button).toBeInTheDocument();
      expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
    });
  });

  describe('インタラクション', () => {
    it('ボタンクリックでtoggleThemeが呼ばれる', () => {
      vi.mocked(useTheme).mockReturnValue({
        theme: 'light',
        isDarkMode: false,
        toggleTheme: mockToggleTheme,
        setTheme: vi.fn(),
        isHydrated: true,
      });

      render(<ThemeToggle />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(mockToggleTheme).toHaveBeenCalledTimes(1);
    });
  });

  describe('アクセシビリティ', () => {
    it('ライトモード時に適切なaria-labelを持つ', () => {
      vi.mocked(useTheme).mockReturnValue({
        theme: 'light',
        isDarkMode: false,
        toggleTheme: mockToggleTheme,
        setTheme: vi.fn(),
        isHydrated: true,
      });

      render(<ThemeToggle />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'ダークモードに切り替え');
    });

    it('ダークモード時に適切なaria-labelを持つ', () => {
      vi.mocked(useTheme).mockReturnValue({
        theme: 'dark',
        isDarkMode: true,
        toggleTheme: mockToggleTheme,
        setTheme: vi.fn(),
        isHydrated: true,
      });

      render(<ThemeToggle />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'ライトモードに切り替え');
    });

    it('ボタンがフォーカス可能である', () => {
      vi.mocked(useTheme).mockReturnValue({
        theme: 'light',
        isDarkMode: false,
        toggleTheme: mockToggleTheme,
        setTheme: vi.fn(),
        isHydrated: true,
      });

      render(<ThemeToggle />);

      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();
    });
  });
});
