import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * clsx と tailwind-merge を組み合わせたユーティリティ関数
 * 条件付きクラス名の構築と、Tailwind CSSのクラス競合を解決する
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
