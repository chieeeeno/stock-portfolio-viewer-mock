'use client';

import type { ReactNode } from 'react';
import { ThemeProvider } from '../_hooks/useTheme';
import OnboardingProvider from '@/components/OnboardingProvider';

interface ProvidersProps {
  children: ReactNode;
}

/**
 * アプリケーション全体で使用するProviderをまとめるコンポーネント
 * - クライアントコンポーネントとして定義
 * - layout.tsxから使用してContextを提供
 */
export default function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <OnboardingProvider>{children}</OnboardingProvider>
    </ThemeProvider>
  );
}
