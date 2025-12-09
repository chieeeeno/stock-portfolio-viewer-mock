'use client';

import { useState, useEffect, useCallback } from 'react';

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

/**
 * テーマ管理用のカスタムフック
 * - localStorageに保存し永続化
 * - システム設定にフォールバック
 * - document.documentElementにdarkクラスを適用
 * - ハイドレーション対応: 初期値は固定、useEffectで実際の値を適用
 */
export function useTheme(): UseThemeReturn {
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

  return {
    theme,
    isDarkMode: theme === 'dark',
    toggleTheme,
    setTheme,
    isHydrated,
  };
}
