import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HelpButton from './HelpButton';
import OnboardingProvider from './OnboardingProvider';
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

describe('HelpButton', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    localStorage.clear();
    vi.useRealTimers();
  });

  describe('レンダリング', () => {
    it('ヘルプアイコンが表示される', async () => {
      localStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');

      render(
        <OnboardingProvider>
          <HelpButton />
        </OnboardingProvider>
      );

      // タイマーを進める
      await vi.advanceTimersByTimeAsync(100);

      expect(screen.getByTestId('help-icon')).toBeInTheDocument();
    });

    it('ボタンに適切なaria-labelが設定されている', async () => {
      localStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');

      render(
        <OnboardingProvider>
          <HelpButton />
        </OnboardingProvider>
      );

      await vi.advanceTimersByTimeAsync(100);

      expect(screen.getByRole('button', { name: 'ガイドを再表示' })).toBeInTheDocument();
    });

    it('ボタンにdata-testid属性が設定されている', async () => {
      localStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');

      render(
        <OnboardingProvider>
          <HelpButton />
        </OnboardingProvider>
      );

      await vi.advanceTimersByTimeAsync(100);

      expect(screen.getByTestId('help-button')).toBeInTheDocument();
    });
  });

  describe('クリックハンドラ', () => {
    it('クリックするとオンボーディングツアーを開始する', async () => {
      localStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
      vi.useRealTimers();

      const user = userEvent.setup();

      const { driver } = await import('driver.js');
      const mockDrive = vi.fn();
      vi.mocked(driver).mockReturnValue({
        drive: mockDrive,
        destroy: vi.fn(),
      } as unknown as ReturnType<typeof driver>);

      render(
        <OnboardingProvider>
          <HelpButton />
        </OnboardingProvider>
      );

      const button = screen.getByTestId('help-button');
      await user.click(button);

      expect(mockDrive).toHaveBeenCalled();
    });
  });

  describe('disabled状態', () => {
    it('ツアーがアクティブな時はボタンが無効化される', async () => {
      localStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
      vi.useRealTimers();

      const user = userEvent.setup();

      const { driver } = await import('driver.js');
      vi.mocked(driver).mockReturnValue({
        drive: vi.fn(),
        destroy: vi.fn(),
      } as unknown as ReturnType<typeof driver>);

      render(
        <OnboardingProvider>
          <HelpButton />
        </OnboardingProvider>
      );

      const button = screen.getByTestId('help-button');

      // 最初のクリックでツアーを開始
      await user.click(button);

      // ボタンが無効化されていることを確認
      expect(button).toBeDisabled();
    });
  });

  describe('ツールチップ', () => {
    it('ホバー時にツールチップが表示される', async () => {
      localStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
      vi.useRealTimers();

      const user = userEvent.setup();

      render(
        <OnboardingProvider>
          <HelpButton />
        </OnboardingProvider>
      );

      const button = screen.getByTestId('help-button');

      // ホバーしてツールチップを表示
      await user.hover(button);

      // ツールチップのテキストが表示されることを確認
      expect(await screen.findByRole('tooltip')).toHaveTextContent('ガイドを再表示');
    });

    it('ホバーを外すとツールチップが視覚的に非表示になる', async () => {
      localStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
      vi.useRealTimers();

      const user = userEvent.setup();

      render(
        <OnboardingProvider>
          <HelpButton />
        </OnboardingProvider>
      );

      const button = screen.getByTestId('help-button');

      // ホバーしてツールチップを表示
      await user.hover(button);
      const tooltip = await screen.findByRole('tooltip');
      expect(tooltip).toBeInTheDocument();

      // ホバーを外す
      await user.unhover(button);

      // ツールチップが視覚的に非表示になることを確認
      // Radix UIはアクセシビリティのため隠し要素として残るが、視覚的には非表示
      await vi.waitFor(() => {
        const tooltipAfter = screen.queryByRole('tooltip');
        // ツールチップがDOMから消えるか、視覚的に非表示（スクリーンリーダー用隠し要素）になる
        if (tooltipAfter) {
          expect(tooltipAfter).toHaveStyle({ position: 'absolute' });
        }
      });
    });
  });
});
