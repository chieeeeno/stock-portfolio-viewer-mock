'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

/** テーマの型 */
export type Theme = 'light' | 'dark';

/** localStorageのキー */
export const THEME_STORAGE_KEY = 'theme';

/** useThemeの戻り値の型 */
export interface UseThemeReturn {
  /** 現在のテーマ */
  theme: Theme;
  /** ダークモードかどうか */
  isDarkMode: boolean;
  /** テーマをトグル */
  toggleTheme: () => void;
  /** テーマを明示的に設定 */
  setTheme: (theme: Theme) => void;
  /** 初期化が完了したかどうか */
  isHydrated: boolean;
}

/** ThemeContextの型 */
const ThemeContext = createContext<UseThemeReturn | null>(null);

/**
 * システムのカラースキーム設定を取得
 */
function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * 保存されたテーマまたはシステム設定からテーマを取得
 */
function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'light';

  // localStorageから取得
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === 'dark' || savedTheme === 'light') {
    return savedTheme;
  }

  // システム設定にフォールバック
  return getSystemTheme();
}

/**
 * DOMにテーマクラスを適用
 */
function applyThemeToDOM(theme: Theme): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

/** ThemeProviderのProps */
interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * テーマ管理用のProvider
 * - アプリケーション全体でテーマ状態を共有
 * - localStorageに保存し永続化
 * - システム設定にフォールバック
 * - document.documentElementにdarkクラスを適用
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  // SSR/クライアント両方で同じ初期値を使用してハイドレーション不一致を防ぐ
  const [theme, setThemeState] = useState<Theme>('light');
  const [isHydrated, setIsHydrated] = useState(false);

  // クライアントサイドでのみ実行: 保存されたテーマを適用
  // SSRとクライアントで同じ初期値を使い、ハイドレーション後に正しいテーマを適用
  useEffect(() => {
    const storedTheme = getStoredTheme();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- ハイドレーション対応のため意図的に使用
    setThemeState(storedTheme);
    applyThemeToDOM(storedTheme);
    setIsHydrated(true);
  }, []);

  // テーマ変更時にDOMとlocalStorageを更新
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    applyThemeToDOM(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
  }, []);

  // テーマをトグル
  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  const value: UseThemeReturn = {
    theme,
    isDarkMode: theme === 'dark',
    toggleTheme,
    setTheme,
    isHydrated,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * テーマ管理用のカスタムフック
 * - ThemeProviderでラップされたコンポーネントで使用可能
 * - Contextを通じてアプリ全体でテーマ状態を共有
 */
export function useTheme(): UseThemeReturn {
  const context = useContext(ThemeContext);

  if (context === null) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
