/**
 * GlobalHeader内で使用するレスポンシブサイズ定数
 *
 * CSSメディアクエリでレイアウトシフト防止のため、
 * Tailwind CSSのレスポンシブクラスを定数として管理する。
 */

/**
 * ヘッダーアイコン用サイズ（ThemeToggle, HelpButton）
 * SP: 20px → タブレット以上: 24px
 */
export const HEADER_ICON_SIZE = 'h-5 w-5 sm:h-6 sm:w-6';

/**
 * ユーザーアバター用サイズ（UserIcon）
 * SP: 32px → タブレット以上: 40px
 */
export const HEADER_AVATAR_SIZE = 'h-8 w-8 sm:h-10 sm:w-10';
