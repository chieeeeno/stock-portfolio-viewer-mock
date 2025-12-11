'use client';

import { useSyncExternalStore, useRef, useCallback } from 'react';

// ブレークポイント: モバイル < 640px, タブレット 640-1023px, デスクトップ >= 1024px
export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

/** throttle処理のデフォルト間隔（ミリ秒） */
const DEFAULT_THROTTLE_MS = 100;

/**
 * ウィンドウ幅からブレークポイントを判定
 */
function getBreakpointFromWidth(width: number): Breakpoint {
  if (width < 640) {
    return 'mobile';
  } else if (width < 1024) {
    return 'tablet';
  } else {
    return 'desktop';
  }
}

/**
 * throttle状態を管理するオブジェクト
 */
interface ThrottleState {
  lastExecutedAt: number;
  timeoutId: ReturnType<typeof setTimeout> | null;
}

/**
 * throttle状態の初期値を作成
 */
function createThrottleState(): ThrottleState {
  return {
    lastExecutedAt: 0,
    timeoutId: null,
  };
}

/**
 * throttle付きでコールバックを実行
 *
 * @param callback - 実行する関数
 * @param state - throttle状態（副作用で更新される）
 * @param intervalMs - throttle間隔（ミリ秒）
 */
function executeWithThrottle(callback: () => void, state: ThrottleState, intervalMs: number): void {
  const now = Date.now();
  const timeSinceLastExecution = now - state.lastExecutedAt;

  if (timeSinceLastExecution >= intervalMs) {
    // throttle間隔を超えていれば即時実行
    state.lastExecutedAt = now;
    callback();
  } else {
    // 間隔内の場合は、前回のタイマーをキャンセルして新しいタイマーを設定
    // リサイズ終了後に最終状態を反映するため
    if (state.timeoutId) {
      clearTimeout(state.timeoutId);
    }
    state.timeoutId = setTimeout(() => {
      state.lastExecutedAt = Date.now();
      callback();
    }, intervalMs - timeSinceLastExecution);
  }
}

/**
 * throttle状態をクリーンアップ
 */
function cleanupThrottleState(state: ThrottleState): void {
  if (state.timeoutId) {
    clearTimeout(state.timeoutId);
    state.timeoutId = null;
  }
}

/**
 * SSR時のブレークポイント（サーバー側ではデスクトップを想定）
 */
function getServerSnapshot(): Breakpoint {
  return 'desktop';
}

/**
 * クライアント側で現在のブレークポイントを取得
 */
function getClientSnapshot(): Breakpoint {
  return getBreakpointFromWidth(window.innerWidth);
}

/**
 * 現在のブレークポイントを取得するカスタムフック
 *
 * Tailwind CSSのブレークポイントに準拠:
 * - mobile: < 640px
 * - tablet: 640px - 1023px
 * - desktop: >= 1024px
 *
 * @param throttleMs - リサイズイベントのthrottle間隔（デフォルト: 100ms）
 */
export function useBreakpoint(throttleMs: number = DEFAULT_THROTTLE_MS): Breakpoint {
  const throttleStateRef = useRef<ThrottleState>(createThrottleState());

  // resizeイベントを購読する関数
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const throttleState = throttleStateRef.current;

      const handleResize = () => {
        executeWithThrottle(onStoreChange, throttleState, throttleMs);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        cleanupThrottleState(throttleState);
      };
    },
    [throttleMs]
  );

  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}
