import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { useTouchDevice } from './useTouchDevice';

describe('useTouchDevice', () => {
  const originalNavigator = global.navigator;

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    // navigatorを元に戻す
    Object.defineProperty(global, 'navigator', {
      value: originalNavigator,
      writable: true,
    });
  });

  describe('タッチデバイス検出', () => {
    it('maxTouchPoints > 0 の場合、trueを返す', () => {
      Object.defineProperty(global, 'navigator', {
        value: { maxTouchPoints: 1 },
        writable: true,
      });

      const { result } = renderHook(() => useTouchDevice());

      expect(result.current).toBe(true);
    });

    it('maxTouchPoints === 0 の場合、falseを返す', () => {
      Object.defineProperty(global, 'navigator', {
        value: { maxTouchPoints: 0 },
        writable: true,
      });

      const { result } = renderHook(() => useTouchDevice());

      expect(result.current).toBe(false);
    });

    it('maxTouchPoints が複数（タブレット等）の場合、trueを返す', () => {
      Object.defineProperty(global, 'navigator', {
        value: { maxTouchPoints: 10 },
        writable: true,
      });

      const { result } = renderHook(() => useTouchDevice());

      expect(result.current).toBe(true);
    });
  });

  describe('SSR対応', () => {
    it('navigatorが未定義の場合、falseを返す', () => {
      Object.defineProperty(global, 'navigator', {
        value: undefined,
        writable: true,
      });

      const { result } = renderHook(() => useTouchDevice());

      expect(result.current).toBe(false);
    });
  });
});
