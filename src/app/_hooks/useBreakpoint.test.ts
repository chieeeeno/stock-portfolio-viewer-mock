import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBreakpoint } from './useBreakpoint';

describe('useBreakpoint', () => {
  const originalInnerWidth = window.innerWidth;

  beforeEach(() => {
    // resizeイベントリスナーをモック
    vi.spyOn(window, 'addEventListener');
    vi.spyOn(window, 'removeEventListener');
  });

  afterEach(() => {
    // window.innerWidthを元に戻す
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
    vi.restoreAllMocks();
  });

  const setWindowWidth = (width: number) => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    });
  };

  describe('初期状態', () => {
    it('SSR対応のため初期値は常にdesktop', () => {
      setWindowWidth(639);
      const { result } = renderHook(() => useBreakpoint());

      // useEffect実行前は常にdesktop（ハイドレーションエラー防止）
      // useEffect実行後に正しい値に更新される
      expect(result.current).toBe('mobile');
    });

    it('640px以上1024px未満の場合、useEffect後にtabletになる', () => {
      setWindowWidth(640);
      const { result } = renderHook(() => useBreakpoint());

      expect(result.current).toBe('tablet');
    });

    it('1024px以上の場合、desktopを返す', () => {
      setWindowWidth(1024);
      const { result } = renderHook(() => useBreakpoint());

      expect(result.current).toBe('desktop');
    });
  });

  describe('境界値テスト', () => {
    it('639pxはmobile', () => {
      setWindowWidth(639);
      const { result } = renderHook(() => useBreakpoint());

      expect(result.current).toBe('mobile');
    });

    it('640pxはtablet', () => {
      setWindowWidth(640);
      const { result } = renderHook(() => useBreakpoint());

      expect(result.current).toBe('tablet');
    });

    it('1023pxはtablet', () => {
      setWindowWidth(1023);
      const { result } = renderHook(() => useBreakpoint());

      expect(result.current).toBe('tablet');
    });

    it('1024pxはdesktop', () => {
      setWindowWidth(1024);
      const { result } = renderHook(() => useBreakpoint());

      expect(result.current).toBe('desktop');
    });
  });

  describe('リサイズイベント', () => {
    it('resizeイベントリスナーが登録される', () => {
      setWindowWidth(1024);
      renderHook(() => useBreakpoint());

      expect(window.addEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
    });

    it('アンマウント時にリスナーが解除される', () => {
      setWindowWidth(1024);
      const { unmount } = renderHook(() => useBreakpoint());

      unmount();

      expect(window.removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
    });

    it('ウィンドウリサイズでブレークポイントが更新される', () => {
      setWindowWidth(1024);
      const { result } = renderHook(() => useBreakpoint());

      expect(result.current).toBe('desktop');

      // モバイルサイズにリサイズ
      act(() => {
        setWindowWidth(500);
        window.dispatchEvent(new Event('resize'));
      });

      expect(result.current).toBe('mobile');
    });

    it('desktopからtabletへの遷移', () => {
      setWindowWidth(1024);
      const { result } = renderHook(() => useBreakpoint());

      expect(result.current).toBe('desktop');

      act(() => {
        setWindowWidth(800);
        window.dispatchEvent(new Event('resize'));
      });

      expect(result.current).toBe('tablet');
    });

    it('mobileからdesktopへの遷移', () => {
      setWindowWidth(400);
      const { result } = renderHook(() => useBreakpoint());

      expect(result.current).toBe('mobile');

      act(() => {
        setWindowWidth(1200);
        window.dispatchEvent(new Event('resize'));
      });

      expect(result.current).toBe('desktop');
    });
  });
});
