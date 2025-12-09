import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import OnboardingProvider, { useOnboardingContext } from './OnboardingProvider';
import { ONBOARDING_COMPLETED_KEY } from '@/utils/onboardingSteps';

// driver.jsをモック
vi.mock('driver.js', () => ({
  driver: vi.fn(() => ({
    drive: vi.fn(),
    destroy: vi.fn(),
  })),
}));

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

// テスト用コンポーネント
function TestConsumer() {
  const { startTour, isCompleted, isActive, isHydrated } = useOnboardingContext();

  return (
    <div>
      <span data-testid="is-completed">{String(isCompleted)}</span>
      <span data-testid="is-active">{String(isActive)}</span>
      <span data-testid="is-hydrated">{String(isHydrated)}</span>
      <button data-testid="start-tour" onClick={startTour}>
        Start Tour
      </button>
    </div>
  );
}

describe('OnboardingProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    localStorage.clear();
    vi.useRealTimers();
  });

  describe('コンテキスト提供', () => {
    it('子コンポーネントにオンボーディングコンテキストを提供する', async () => {
      vi.useRealTimers();

      render(
        <OnboardingProvider>
          <TestConsumer />
        </OnboardingProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-hydrated').textContent).toBe('true');
      });

      expect(screen.getByTestId('is-completed')).toBeInTheDocument();
      expect(screen.getByTestId('is-active')).toBeInTheDocument();
      expect(screen.getByTestId('start-tour')).toBeInTheDocument();
    });

    it('Provider外で使用するとエラーをスローする', () => {
      // エラーを抑制
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<TestConsumer />);
      }).toThrow('useOnboardingContext must be used within an OnboardingProvider');

      consoleSpy.mockRestore();
    });
  });

  describe('初回訪問時の自動開始', () => {
    it('localStorageに完了フラグがない場合、自動的にツアーを開始する', async () => {
      const { driver } = await import('driver.js');
      const mockDrive = vi.fn();
      vi.mocked(driver).mockReturnValue({
        drive: mockDrive,
        destroy: vi.fn(),
      } as ReturnType<typeof driver>);

      render(
        <OnboardingProvider>
          <TestConsumer />
        </OnboardingProvider>
      );

      // タイマーを進める（自動開始の遅延）
      await vi.advanceTimersByTimeAsync(600);

      expect(mockDrive).toHaveBeenCalled();
    });

    it('localStorageに完了フラグがある場合、自動開始しない', async () => {
      localStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');

      const { driver } = await import('driver.js');
      const mockDrive = vi.fn();
      vi.mocked(driver).mockReturnValue({
        drive: mockDrive,
        destroy: vi.fn(),
      } as ReturnType<typeof driver>);

      render(
        <OnboardingProvider>
          <TestConsumer />
        </OnboardingProvider>
      );

      // タイマーを進める
      await vi.advanceTimersByTimeAsync(600);

      expect(mockDrive).not.toHaveBeenCalled();
    });
  });

  describe('手動開始', () => {
    it('startTourボタンをクリックするとツアーを開始する', async () => {
      localStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true'); // 自動開始を防ぐ
      vi.useRealTimers();

      const user = userEvent.setup();

      const { driver } = await import('driver.js');
      const mockDrive = vi.fn();
      vi.mocked(driver).mockReturnValue({
        drive: mockDrive,
        destroy: vi.fn(),
      } as ReturnType<typeof driver>);

      render(
        <OnboardingProvider>
          <TestConsumer />
        </OnboardingProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('is-hydrated').textContent).toBe('true');
      });

      await user.click(screen.getByTestId('start-tour'));

      expect(mockDrive).toHaveBeenCalled();
    });
  });
});
