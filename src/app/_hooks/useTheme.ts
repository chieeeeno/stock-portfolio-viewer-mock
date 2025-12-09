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
function getInitialTheme(): Theme {
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
 */
export function useTheme(): UseThemeReturn {
  const [theme, setThemeState] = useState<Theme>(() => getInitialTheme());

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

  // 初期マウント時にDOMにテーマを適用
  useEffect(() => {
    applyThemeToDOM(theme);
  }, [theme]);

  return {
    theme,
    isDarkMode: theme === 'dark',
    toggleTheme,
    setTheme,
  };
}
