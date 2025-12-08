interface UserIconProps {
  /** ユーザー名（頭文字表示用） */
  name?: string;
}

/**
 * ユーザーアイコンコンポーネント
 * - ユーザー名の頭文字を表示
 * - デフォルトは「U」
 */
export default function UserIcon({ name = 'User' }: UserIconProps) {
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">
      {initial}
    </div>
  );
}
