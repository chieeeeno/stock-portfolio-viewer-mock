'use client';

import { useSyncExternalStore } from 'react';

/**
 * タッチデバイスかどうかを判定
 * navigator.maxTouchPoints > 0 でタッチ対応を検出
 */
function getIsTouchDevice(): boolean {
  if (typeof navigator === 'undefined') {
    return false;
  }
  return navigator.maxTouchPoints > 0;
}

/**
 * SSR時のスナップショット（非タッチデバイスとして扱う）
 */
function getServerSnapshot(): boolean {
  return false;
}

/**
 * クライアント側でタッチデバイスかどうかを取得
 */
function getClientSnapshot(): boolean {
  return getIsTouchDevice();
}

/**
 * タッチデバイスかどうかを検出するカスタムフック
 *
 * - タッチデバイス（スマートフォン・タブレット）: true
 * - 非タッチデバイス（PC）: false
 * - SSR時: false（非タッチデバイスとして扱う）
 *
 * @returns タッチデバイスの場合true
 */
export function useTouchDevice(): boolean {
  // タッチデバイスの状態は基本的に変化しないため、subscribeは空の関数
  const subscribe = () => () => {};

  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}
