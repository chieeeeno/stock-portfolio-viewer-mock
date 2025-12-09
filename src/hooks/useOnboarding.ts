'use client';

import { useCallback, useEffect, useRef, useSyncExternalStore, useState } from 'react';
import { driver, type Driver, type Config } from 'driver.js';
import { ONBOARDING_STEPS, ONBOARDING_COMPLETED_KEY } from '@/utils/onboardingSteps';

/**
 * オンボーディングフックの戻り値
 */
export interface UseOnboardingReturn {
  /** オンボーディングを開始する */
  startTour: () => void;
  /** オンボーディングが完了済みかどうか */
  isCompleted: boolean;
  /** オンボーディングがアクティブかどうか */
  isActive: boolean;
  /** ハイドレーション完了フラグ */
  isHydrated: boolean;
}

// localStorageの完了状態を監視するためのサブスクライバー
let completedListeners: Array<() => void> = [];

function subscribeToCompleted(callback: () => void) {
  completedListeners = [...completedListeners, callback];
  return () => {
    completedListeners = completedListeners.filter((l) => l !== callback);
  };
}

function getCompletedSnapshot(): boolean {
  return localStorage.getItem(ONBOARDING_COMPLETED_KEY) === 'true';
}

function getServerSnapshot(): boolean {
  return false; // SSRでは未完了として扱う
}

function notifyCompletedChange() {
  completedListeners.forEach((listener) => listener());
}

/**
 * オンボーディング機能を提供するカスタムフック
 *
 * - driver.jsを使用してインタラクティブなガイドを表示
 * - 完了/スキップ状態をlocalStorageで永続化
 * - 初回訪問時に自動開始
 */
export function useOnboarding(): UseOnboardingReturn {
  // useSyncExternalStoreを使用してlocalStorageの状態を監視
  const isCompleted = useSyncExternalStore(
    subscribeToCompleted,
    getCompletedSnapshot,
    getServerSnapshot
  );

  // isActiveはReact stateで管理（イベントハンドラ内で更新するため問題ない）
  const [isActive, setIsActive] = useState(false);

  const driverRef = useRef<Driver | null>(null);

  // オンボーディング完了時のハンドラ
  const handleComplete = useCallback(() => {
    localStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
    notifyCompletedChange();
    setIsActive(false);
  }, []);

  // driver.jsインスタンスを初期化
  const initDriver = useCallback(() => {
    const config: Config = {
      showProgress: true,
      progressText: '{{current}} / {{total}}',
      showButtons: ['next', 'previous', 'close'],
      nextBtnText: '次へ',
      prevBtnText: '前へ',
      doneBtnText: '完了',
      // ハイライト領域の設定（くり抜き効果）
      stagePadding: 10,
      stageRadius: 8,
      steps: ONBOARDING_STEPS,
      onDestroyed: () => {
        handleComplete();
      },
    };

    return driver(config);
  }, [handleComplete]);

  // オンボーディングを開始
  const startTour = useCallback(() => {
    // 既存のインスタンスを破棄
    if (driverRef.current) {
      driverRef.current.destroy();
    }

    // 新しいインスタンスを作成して開始
    const driverObj = initDriver();
    driverRef.current = driverObj;
    setIsActive(true);
    driverObj.drive();
  }, [initDriver]);

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (driverRef.current) {
        driverRef.current.destroy();
      }
    };
  }, []);

  // ハイドレーション判定（SSRではfalse、クライアントではtrue）
  const isHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  return {
    startTour,
    isCompleted,
    isActive,
    isHydrated,
  };
}
