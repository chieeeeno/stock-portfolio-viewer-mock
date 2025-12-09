'use client';

import type { ReactNode } from 'react';
import { ThemeProvider } from '../_hooks/useTheme';

interface ProvidersProps {
  children: ReactNode;
}

/**
 * アプリケーション全体で使用するProviderをまとめるコンポーネント
 * - クライアントコンポーネントとして定義
 * - layout.tsxから使用してContextを提供
 */
export default function Providers({ children }: ProvidersProps) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
