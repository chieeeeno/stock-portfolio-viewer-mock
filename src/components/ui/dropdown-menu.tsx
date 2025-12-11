'use client';

import { type ComponentProps } from 'react';
import {
  Root,
  Trigger,
  Portal,
  Content,
  Item,
  Separator,
  Label,
} from '@radix-ui/react-dropdown-menu';

import { cn } from '@/lib/utils';

function DropdownMenu({ ...props }: ComponentProps<typeof Root>) {
  return <Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuTrigger({ ...props }: ComponentProps<typeof Trigger>) {
  return <Trigger data-slot="dropdown-menu-trigger" {...props} />;
}

function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}: ComponentProps<typeof Content>) {
  return (
    <Portal>
      <Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(
          // ベーススタイル
          'z-50 min-w-32 overflow-hidden rounded-lg border p-1 shadow-lg',
          'border-gray-200 bg-white',
          // アニメーション（表示時）
          'animate-in fade-in-0 zoom-in-95 origin-(--radix-dropdown-menu-content-transform-origin)',
          // アニメーション（非表示時）
          'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
          // スライド方向
          'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
          'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          // ダークモード
          'dark:border-zinc-700 dark:bg-zinc-800',
          className
        )}
        {...props}
      />
    </Portal>
  );
}

function DropdownMenuItem({ className, ...props }: ComponentProps<typeof Item>) {
  return (
    <Item
      data-slot="dropdown-menu-item"
      className={cn(
        // ベーススタイル
        'relative flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm outline-none select-none',
        'text-gray-900',
        // ホバー・フォーカス状態
        'hover:bg-gray-100 focus:bg-gray-100',
        // 無効状態
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        // ダークモード
        'dark:text-gray-100 dark:hover:bg-zinc-700 dark:focus:bg-zinc-700',
        className
      )}
      {...props}
    />
  );
}

function DropdownMenuSeparator({ className, ...props }: ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="dropdown-menu-separator"
      className={cn('-mx-1 my-1 h-px bg-gray-200 dark:bg-zinc-700', className)}
      {...props}
    />
  );
}

function DropdownMenuLabel({ className, ...props }: ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot="dropdown-menu-label"
      className={cn('px-3 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400', className)}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
};
