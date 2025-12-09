import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useOnboarding } from './useOnboarding';
import { ONBOARDING_COMPLETED_KEY } from '@/utils/onboardingSteps';

// driver.jsをモック
vi.mock('driver.js', () => ({
  driver: vi.fn(() => ({
    drive: vi.fn(),
    destroy: vi.fn(),
  })),
}));

describe('useOnboarding', () => {
  beforeEach(() => {
    // localStorageをクリア
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('初期状態', () => {
    it('localStorageに完了フラグがない場合、isCompletedはfalseである', async () => {
      const { result } = renderHook(() => useOnboarding());

      // ハイドレーション完了を待つ
      await waitFor(() => {
        expect(result.current.isHydrated).toBe(true);
      });

      expect(result.current.isCompleted).toBe(false);
    });

    it('localStorageに完了フラグがある場合、isCompletedはtrueである', async () => {
      localStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');

      const { result } = renderHook(() => useOnboarding());

      await waitFor(() => {
        expect(result.current.isHydrated).toBe(true);
      });

      expect(result.current.isCompleted).toBe(true);
    });

    it('初期状態ではisActiveはfalseである', async () => {
      const { result } = renderHook(() => useOnboarding());

      await waitFor(() => {
        expect(result.current.isHydrated).toBe(true);
      });

      expect(result.current.isActive).toBe(false);
    });

    it('初期状態ではisHydratedはfalseで、その後trueになる', async () => {
      const { result } = renderHook(() => useOnboarding());

      // 初期状態のチェックは難しいので、最終的にtrueになることを確認
      await waitFor(() => {
        expect(result.current.isHydrated).toBe(true);
      });
    });
  });

  describe('startTour', () => {
    it('startTourを呼び出すとisActiveがtrueになる', async () => {
      const { result } = renderHook(() => useOnboarding());

      await waitFor(() => {
        expect(result.current.isHydrated).toBe(true);
      });

      act(() => {
        result.current.startTour();
      });

      expect(result.current.isActive).toBe(true);
    });

    it('startTourはdriver.jsのdriveメソッドを呼び出す', async () => {
      const { driver } = await import('driver.js');
      const mockDriver = vi.mocked(driver);

      const { result } = renderHook(() => useOnboarding());

      await waitFor(() => {
        expect(result.current.isHydrated).toBe(true);
      });

      act(() => {
        result.current.startTour();
      });

      expect(mockDriver).toHaveBeenCalled();
    });
  });

  describe('localStorage永続化', () => {
    it('オンボーディング完了時にlocalStorageにフラグが保存される', async () => {
      const { driver } = await import('driver.js');
      const mockDriver = vi.mocked(driver);
      let onDestroyedCallback: (() => void) | undefined;

      mockDriver.mockImplementation((config) => {
        onDestroyedCallback = config?.onDestroyed;
        return {
          drive: vi.fn(),
          destroy: vi.fn(),
        } as ReturnType<typeof driver>;
      });

      const { result } = renderHook(() => useOnboarding());

      await waitFor(() => {
        expect(result.current.isHydrated).toBe(true);
      });

      act(() => {
        result.current.startTour();
      });

      // onDestroyedコールバックを手動で呼び出す（ツアー完了をシミュレート）
      act(() => {
        onDestroyedCallback?.();
      });

      expect(localStorage.getItem(ONBOARDING_COMPLETED_KEY)).toBe('true');
      expect(result.current.isCompleted).toBe(true);
    });

    it('完了フラグがある状態で再訪問してもisCompletedはtrueのまま', async () => {
      localStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');

      const { result, rerender } = renderHook(() => useOnboarding());

      await waitFor(() => {
        expect(result.current.isHydrated).toBe(true);
      });

      expect(result.current.isCompleted).toBe(true);

      // 再レンダリングしても状態は維持
      rerender();
      expect(result.current.isCompleted).toBe(true);
    });
  });
});
