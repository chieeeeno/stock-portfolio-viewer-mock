import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import GlobalHeader from './GlobalHeader';
import { APP_NAME } from '@/utils/constants';

// useThemeフックをモック
vi.mock('@/app/_hooks/useTheme', () => ({
  useTheme: vi.fn(() => ({
    theme: 'light',
    isDarkMode: false,
    toggleTheme: vi.fn(),
    setTheme: vi.fn(),
    isHydrated: true,
  })),
}));

// useOnboardingフックをモック
vi.mock('@/hooks/useOnboarding', () => ({
  useOnboarding: vi.fn(() => ({
    startTour: vi.fn(),
    isCompleted: false,
    isActive: false,
    isHydrated: true,
  })),
}));

// OnboardingProviderをモック
vi.mock('./OnboardingProvider', () => ({
  useOnboardingContext: vi.fn(() => ({
    startTour: vi.fn(),
    isCompleted: false,
    isActive: false,
    isHydrated: true,
  })),
  default: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

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

describe('GlobalHeader', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
    localStorageMock.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('描画', () => {
    it('デフォルトのアプリ名を表示', () => {
      render(<GlobalHeader />);

      expect(screen.getByRole('heading', { name: APP_NAME })).toBeInTheDocument();
    });

    it('カスタムアプリ名を表示', () => {
      const customName = 'Custom App';
      render(<GlobalHeader appName={customName} />);

      expect(screen.getByRole('heading', { name: customName })).toBeInTheDocument();
    });

    it('ThemeToggleボタンを表示', () => {
      render(<GlobalHeader />);

      // テーマ切り替えボタンが存在する
      expect(screen.getByRole('button', { name: /モードに切り替え/i })).toBeInTheDocument();
    });

    it('ユーザーアイコンを表示', () => {
      render(<GlobalHeader userName="Test User" />);

      // UserIconのMDIアイコンが表示される
      expect(screen.getByTestId('user-icon')).toBeInTheDocument();
    });

    it('ヘルプボタンを表示', () => {
      render(<GlobalHeader />);

      expect(screen.getByRole('button', { name: 'ガイドを再表示' })).toBeInTheDocument();
    });
  });

  describe('構造', () => {
    it('headerタグをルート要素として使用', () => {
      const { container } = render(<GlobalHeader />);

      expect(container.querySelector('header')).toBeInTheDocument();
    });

    it('sticky位置決めクラスを持つ', () => {
      const { container } = render(<GlobalHeader />);
      const header = container.querySelector('header');

      expect(header).toHaveClass('sticky');
      expect(header).toHaveClass('top-0');
    });
  });
});
