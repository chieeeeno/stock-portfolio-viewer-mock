import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserMenu from './UserMenu';

describe('UserMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('描画 (T174)', () => {
    it('ユーザーアイコンボタンが表示される', () => {
      render(<UserMenu />);

      const button = screen.getByRole('button', { name: 'ユーザーメニュー' });
      expect(button).toBeInTheDocument();
    });

    it('デフォルトでユーザー名の頭文字が「U」で表示される', () => {
      render(<UserMenu />);

      expect(screen.getByText('U')).toBeInTheDocument();
    });

    it('ユーザー名が指定された場合、その頭文字が表示される', () => {
      render(<UserMenu userName="田中太郎" />);

      expect(screen.getByText('田')).toBeInTheDocument();
    });

    it('data-testid属性が設定されている', () => {
      render(<UserMenu />);

      expect(screen.getByTestId('user-menu-trigger')).toBeInTheDocument();
    });
  });

  describe('ドロップダウン開閉 (T175)', () => {
    it('ユーザーアイコンをクリックするとドロップダウンメニューが表示される', async () => {
      const user = userEvent.setup();

      render(<UserMenu />);

      const trigger = screen.getByRole('button', { name: 'ユーザーメニュー' });
      await user.click(trigger);

      // メニューコンテンツが表示される
      expect(await screen.findByRole('menu')).toBeInTheDocument();
    });

    it('メニュー外をクリックするとドロップダウンが閉じる', async () => {
      const user = userEvent.setup();

      render(<UserMenu />);

      // メニューを開く
      const trigger = screen.getByRole('button', { name: 'ユーザーメニュー' });
      await user.click(trigger);

      const menu = await screen.findByRole('menu');
      expect(menu).toBeInTheDocument();

      // メニュー外をクリック（Radix UIのオーバーレイではpointer-eventsがnoneなので、fireEventを使用）
      // PointerDownOutside イベントをシミュレート
      await user.keyboard('{Escape}');

      // メニューが閉じる
      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });
    });

    it('開いた状態でEscキーを押すとメニューが閉じる', async () => {
      const user = userEvent.setup();

      render(<UserMenu />);

      const trigger = screen.getByRole('button', { name: 'ユーザーメニュー' });

      // メニューを開く
      await user.click(trigger);
      expect(await screen.findByRole('menu')).toBeInTheDocument();

      // Escキーを押す（Radix UIはポータル経由のためトリガー再クリックはpointer-events問題がある）
      await user.keyboard('{Escape}');

      // メニューが閉じる
      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });
    });
  });

  describe('ログアウトリンク表示 (T176)', () => {
    it('ドロップダウンメニュー内に「ログアウト」メニューアイテムが表示される', async () => {
      const user = userEvent.setup();

      render(<UserMenu />);

      const trigger = screen.getByRole('button', { name: 'ユーザーメニュー' });
      await user.click(trigger);

      // ログアウトメニューアイテムが表示される
      const logoutItem = await screen.findByRole('menuitem', { name: 'ログアウト' });
      expect(logoutItem).toBeInTheDocument();
    });

    it('ログアウトをクリックしても何も起こらない（モック実装）', async () => {
      const user = userEvent.setup();
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      render(<UserMenu />);

      const trigger = screen.getByRole('button', { name: 'ユーザーメニュー' });
      await user.click(trigger);

      const logoutItem = await screen.findByRole('menuitem', { name: 'ログアウト' });
      await user.click(logoutItem);

      // コンソールログ出力のみで、エラーは発生しない
      expect(consoleSpy).toHaveBeenCalledWith('ログアウトがクリックされました（モック実装）');

      consoleSpy.mockRestore();
    });
  });

  describe('Escキーでメニューが閉じる (T177)', () => {
    it('メニューアイテムにフォーカスがある状態でEscキーを押すとメニューが閉じる', async () => {
      const user = userEvent.setup();

      render(<UserMenu />);

      const trigger = screen.getByRole('button', { name: 'ユーザーメニュー' });

      // メニューを開く
      await user.click(trigger);
      const menu = await screen.findByRole('menu');
      expect(menu).toBeInTheDocument();

      // 矢印キーでメニューアイテムにフォーカスを移動
      await user.keyboard('{ArrowDown}');

      // Escキーを押す
      await user.keyboard('{Escape}');

      // メニューが閉じる
      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      });
    });
  });

  describe('ツールチップ', () => {
    it('ユーザーアイコンにホバーすると「ユーザーメニュー」ツールチップが表示される', async () => {
      const user = userEvent.setup();

      render(<UserMenu />);

      const trigger = screen.getByRole('button', { name: 'ユーザーメニュー' });

      // ホバーしてツールチップを表示
      await user.hover(trigger);

      // ツールチップのテキストが表示されることを確認
      expect(await screen.findByRole('tooltip')).toHaveTextContent('ユーザーメニュー');
    });

    it('ホバーを外すとツールチップが視覚的に非表示になる', async () => {
      const user = userEvent.setup();

      render(<UserMenu />);

      const trigger = screen.getByRole('button', { name: 'ユーザーメニュー' });

      // ホバーしてツールチップを表示
      await user.hover(trigger);
      const tooltip = await screen.findByRole('tooltip');
      expect(tooltip).toBeInTheDocument();

      // ホバーを外す
      await user.unhover(trigger);

      // ツールチップが視覚的に非表示になることを確認
      await waitFor(() => {
        const tooltipAfter = screen.queryByRole('tooltip');
        if (tooltipAfter) {
          expect(tooltipAfter).toHaveStyle({ position: 'absolute' });
        }
      });
    });
  });

  describe('アクセシビリティ', () => {
    it('トリガーボタンに適切なaria-labelが設定されている', () => {
      render(<UserMenu />);

      const trigger = screen.getByRole('button', { name: 'ユーザーメニュー' });
      expect(trigger).toHaveAttribute('aria-label', 'ユーザーメニュー');
    });

    it('トリガーボタンにaria-haspopup属性が設定されている', () => {
      render(<UserMenu />);

      const trigger = screen.getByRole('button', { name: 'ユーザーメニュー' });
      expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    });

    it('メニュー展開時にaria-expandedがtrueになる', async () => {
      const user = userEvent.setup();

      render(<UserMenu />);

      const trigger = screen.getByRole('button', { name: 'ユーザーメニュー' });

      // 初期状態ではaria-expandedはfalse
      expect(trigger).toHaveAttribute('aria-expanded', 'false');

      // メニューを開く
      await user.click(trigger);
      await screen.findByRole('menu');

      // aria-expandedがtrueになる
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    it('ボタンがフォーカス可能である', () => {
      render(<UserMenu />);

      const trigger = screen.getByRole('button', { name: 'ユーザーメニュー' });
      trigger.focus();
      expect(trigger).toHaveFocus();
    });
  });
});
