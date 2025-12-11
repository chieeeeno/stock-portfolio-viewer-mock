'use client';

import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { useOnboarding, type UseOnboardingReturn } from '@/hooks/useOnboarding';
import { useTheme } from '@/app/_hooks/useTheme';
import 'driver.js/dist/driver.css';

/**
 * オンボーディングコンテキストの型
 */
type OnboardingContextType = UseOnboardingReturn;

/**
 * オンボーディングコンテキスト
 */
const OnboardingContext = createContext<OnboardingContextType | null>(null);

/**
 * オンボーディングコンテキストを使用するカスタムフック
 * @throws OnboardingProvider外で使用された場合
 */
export function useOnboardingContext(): OnboardingContextType {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboardingContext must be used within an OnboardingProvider');
  }
  return context;
}

interface OnboardingProviderProps {
  children: ReactNode;
}

/**
 * オンボーディング機能を提供するプロバイダーコンポーネント
 *
 * - 初回訪問時（localStorageにフラグがない場合）に自動開始
 * - 子コンポーネントからstartTourを呼び出して手動開始も可能
 */
export default function OnboardingProvider({ children }: OnboardingProviderProps) {
  const { isDarkMode } = useTheme();
  const onboarding = useOnboarding({ isDarkMode });

  // 初回訪問時に自動開始（ハイドレーション完了後、未完了の場合）
  // 依存配列は個別プロパティを列挙している（オブジェクト全体を入れると不要な再実行が発生）
  const { isHydrated, isCompleted, isActive, startTour } = onboarding;
  useEffect(() => {
    if (isHydrated && !isCompleted && !isActive) {
      // DOMが完全に描画されるまで少し待つ
      const timer = setTimeout(() => {
        startTour();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isHydrated, isCompleted, isActive, startTour]);

  return <OnboardingContext.Provider value={onboarding}>{children}</OnboardingContext.Provider>;
}
