import clsx from 'clsx';

type IconSize = 'sm' | 'md' | 'lg';

interface IconProps {
  /** MDIのSVGパス文字列 (例: mdiWeatherSunny) */
  path: string;
  /** アイコンのサイズ */
  size?: IconSize;
  /** 追加のCSSクラス */
  className?: string;
  /** テスト用のdata-testid */
  'data-testid'?: string;
  /** アクセシビリティラベル */
  'aria-label'?: string;
  /** アクセシビリティ: 装飾的かどうか */
  'aria-hidden'?: boolean;
}

const SIZE_CLASSES: Record<IconSize, string> = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

/**
 * Material Design Icons（@mdi/js）用の汎用アイコンコンポーネント
 *
 * @example
 * ```tsx
 * import { mdiWeatherSunny } from '@mdi/js';
 * <Icon path={mdiWeatherSunny} size="md" />
 * ```
 */
export default function Icon({
  path,
  size = 'md',
  className,
  'data-testid': testId,
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden = true,
}: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={clsx(SIZE_CLASSES[size], className)}
      data-testid={testId}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      role={ariaLabel ? 'img' : undefined}
    >
      <path d={path} />
    </svg>
  );
}
