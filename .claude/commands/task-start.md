---
description: git worktreeを使って新しいタスク用の並列作業環境を作成します。
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Goal

git worktreeを使用して、タスクごとに独立した作業環境を作成し、複数のタスクを並列で進められるようにします。

## Execution Steps

### 1. タスク名の取得と検証

**重要**: この段階でユーザーに必要な情報をすべて確認します。この後はユーザーの確認なしで自動実行します。

**AskUserQuestionツールで一度に質問:**

`$ARGUMENTS` が空の場合のみ、以下の質問をします（引数がある場合はタスク名として使用し、ベースブランチとIssue作成のみ質問）:

```
質問1: "タスク名を入力してください:"
  - タスク名を短いテキストで入力（例: ユーザー認証機能、バグ修正、パフォーマンス改善など）

質問2: "ベースブランチを選択してください:"
  選択肢:
    - current (デフォルト): 現在のブランチから分岐
    - main: mainブランチから分岐
    - develop: developブランチから分岐
    - Other: 任意のブランチ名を入力

質問3: "GitHub Issueを作成しますか？"
  選択肢:
    - No (デフォルト): Issueを作成しない
    - Yes: worktree作成後にGitHub Issueを作成
```

**引数がある場合:**
- タスク名は `$ARGUMENTS` を使用
- ベースブランチとIssue作成のみ質問

**この後の処理:**
- ユーザーの回答を受け取ったら、以降はユーザーの確認なしで自動的に以下を実行:
  1. タスク名の英訳
  2. ブランチ名の生成
  3. ベースブランチの存在確認
  4. worktreeディレクトリの作成
  5. ブランチ存在確認（既存の場合は連番を付けて別名に変更）
  6. worktreeの作成（指定されたベースブランチから分岐）
  7. GitHub Issue作成（Yesの場合）
  8. worktreeディレクトリに移動
  9. 依存パッケージのインストール（pnpm install）
  10. 環境設定ファイルの作成（.env.example → .env.local）
  11. 利用可能なポートの検索
  12. .env.localのAPI_BASE_URLを更新
  13. 開発サーバーの起動（バックグラウンド）
  14. VSCodeで開く
  15. リポジトリのルートディレクトリに戻る

**重要な注意事項:**
- ブランチが既に存在する場合、削除せず連番を付けて別のブランチ名を生成します
  - 例: `worktree/test-task` → `worktree/test-task-2`
- エラーが発生した場合のみエラーメッセージを表示して処理を中断します
- タスク名に使用できない文字（スラッシュなど）が含まれていないか確認

### 2. タスク名の英訳

タスク名が日本語の場合、英語に翻訳します：

- Claude の翻訳機能を使用してタスク名を英訳
- 英訳結果をケバブケース（lowercase-with-hyphens）に変換
- 例: "ユーザー認証機能" → "user-authentication-feature"

英訳のガイドライン：
- 簡潔で明確な英語表現を使用
- 2-5単語程度に収める
- 技術用語は業界標準の用語を使用
- スペースはハイフンに置き換え
- すべて小文字に変換

### 3. ブランチ名の生成

- フォーマット: `worktree/[英訳されたタスク名]`
- 例: `worktree/user-authentication-feature`

### 4. worktreeディレクトリの確認と作成

```bash
# リポジトリのルートディレクトリを取得
REPO_ROOT=$(git rev-parse --show-toplevel)

# worktreeディレクトリのパスを設定
WORKTREE_BASE="$REPO_ROOT/worktree"

# ディレクトリが存在しない場合は作成
if [ ! -d "$WORKTREE_BASE" ]; then
    mkdir -p "$WORKTREE_BASE"
    echo "✓ worktreeディレクトリを作成しました: $WORKTREE_BASE"
fi
```

### 5. ブランチの存在確認と連番による衝突回避

**重要**: 既存のブランチがある場合、削除せずに連番を付けて新しいブランチ名を生成します。

```bash
# ブランチが既に存在する場合、連番を付けて別名にする
ORIGINAL_BRANCH_NAME="$BRANCH_NAME"
ORIGINAL_TASK_NAME_EN="$TASK_NAME_EN"
COUNTER=2

while git show-ref --verify --quiet "refs/heads/$BRANCH_NAME"; do
    echo "⚠ ブランチ '$BRANCH_NAME' は既に存在します"
    echo "連番を付けて別のブランチ名を生成します..."

    BRANCH_NAME="$ORIGINAL_BRANCH_NAME-$COUNTER"
    TASK_NAME_EN="$ORIGINAL_TASK_NAME_EN-$COUNTER"
    COUNTER=$((COUNTER + 1))

    echo "新しいブランチ名: $BRANCH_NAME"
done

if [ "$BRANCH_NAME" != "$ORIGINAL_BRANCH_NAME" ]; then
    echo "✓ 衝突を避けるため、ブランチ名を変更しました"
    echo "  元: $ORIGINAL_BRANCH_NAME"
    echo "  新: $BRANCH_NAME"
    echo ""
fi

echo "✓ ブランチ '$BRANCH_NAME' を作成します"
```

**動作例:**
- `worktree/test-task` が存在する場合 → `worktree/test-task-2` を作成
- `worktree/test-task-2` も存在する場合 → `worktree/test-task-3` を作成
- 利用可能なブランチ名が見つかるまで連番を増やします

### 6. ベースブランチの存在確認

```bash
# ベースブランチの決定
# "current" の場合は現在のブランチを使用
if [ "$BASE_BRANCH" = "current" ]; then
    BASE_BRANCH=$(git rev-parse --abbrev-ref HEAD)
    echo "✓ 現在のブランチ '$BASE_BRANCH' をベースにします"
fi

# ベースブランチの存在確認
if ! git show-ref --verify --quiet "refs/heads/$BASE_BRANCH"; then
    # リモートブランチを確認
    if git show-ref --verify --quiet "refs/remotes/origin/$BASE_BRANCH"; then
        echo "✓ リモートブランチ 'origin/$BASE_BRANCH' を使用します"
    else
        echo "エラー: ブランチ '$BASE_BRANCH' が見つかりません"
        exit 1
    fi
fi
```

### 7. worktreeの作成

```bash
# 指定されたベースブランチから新しいブランチを作成してworktreeを追加
WORKTREE_PATH="$WORKTREE_BASE/$TASK_NAME_EN"

git worktree add -b "$BRANCH_NAME" "$WORKTREE_PATH" "$BASE_BRANCH"
```

エラーハンドリング：
- worktree作成に失敗した場合は適切なエラーメッセージを表示
- ディスク容量不足などの一般的なエラーケースを考慮

### 8. worktree情報の表示

```bash
echo ""
echo "=== Worktree環境のセットアップが完了しました ==="
echo ""
echo "ブランチ名: $BRANCH_NAME"
echo "作業ディレクトリ: $WORKTREE_PATH"
echo ""
echo "利用可能なコマンド:"
echo "  cd $WORKTREE_PATH    # worktreeに移動"
echo "  code $WORKTREE_PATH  # VSCodeで開く"
echo ""
```

### 9. GitHub Issueの作成（オプション）

ユーザーが「Yes」を選択した場合のみ実行します：

**前提条件の確認:**
```bash
# GitHubリモートの確認
REMOTE_URL=$(git config --get remote.origin.url)

# GitHubリポジトリかチェック
if [[ ! "$REMOTE_URL" =~ github\.com ]]; then
    echo "⚠ GitHubリモートが設定されていません。Issue作成をスキップします。"
    exit 0
fi
```

**Issue作成:**

以下の情報でGitHub Issueを作成します：

- **タイトル**: タスク名（日本語のまま）
- **本文**:
  ```markdown
  ## タスク概要
  [タスク名]

  ## 作業ブランチ
  `[BRANCH_NAME]`

  ## 作業ディレクトリ
  `[WORKTREE_PATH]`

  ## 作成日時
  [現在の日時]

  ---
  このIssueは `/task-start` コマンドで自動生成されました。
  ```

- **ラベル**: `worktree`, `task` （存在する場合のみ）

**Issue作成後:**
```bash
echo ""
echo "✓ GitHub Issueを作成しました: #[ISSUE_NUMBER]"
echo "  URL: [ISSUE_URL]"
echo ""
```

### 10. worktreeディレクトリに移動

```bash
# worktreeディレクトリに移動
cd "$WORKTREE_PATH"
echo "✓ worktreeディレクトリに移動しました: $WORKTREE_PATH"
```

### 11. 依存パッケージのインストール

```bash
# pnpmで依存パッケージをインストール
echo "依存パッケージをインストールしています..."
pnpm install
echo "✓ 依存パッケージのインストールが完了しました"
```

### 12. 環境設定ファイルの作成

```bash
# .env.exampleを.env.localにコピー
if [ -f ".env.example" ]; then
    cp .env.example .env.local
    echo "✓ .env.localを作成しました"
else
    echo "⚠ .env.exampleが見つかりません。環境設定ファイルの作成をスキップします。"
fi
```

### 13. 利用可能なポートの検索

デフォルトポート3000から順番に利用可能なポートを検索します：

```bash
# 利用可能なポートを検索（3000から開始）
PORT=3000
MAX_PORT=3010

while [ $PORT -le $MAX_PORT ]; do
    # ポートが使用中かチェック（lsofまたはnetstat使用）
    if ! lsof -i :$PORT > /dev/null 2>&1; then
        echo "✓ 利用可能なポートを見つけました: $PORT"
        break
    fi
    echo "ポート $PORT は使用中です。次のポートを確認します..."
    PORT=$((PORT + 1))
done

if [ $PORT -gt $MAX_PORT ]; then
    echo "⚠ 利用可能なポートが見つかりませんでした。デフォルトの3000を使用します。"
    PORT=3000
fi
```

### 14. .env.localのAPI_BASE_URLを更新

```bash
# .env.localのAPI_BASE_URLのポート番号を更新
if [ -f ".env.local" ]; then
    # macOSとLinuxの両方で動作するsed
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s|API_BASE_URL=http://localhost:[0-9]*|API_BASE_URL=http://localhost:$PORT|g" .env.local
    else
        sed -i "s|API_BASE_URL=http://localhost:[0-9]*|API_BASE_URL=http://localhost:$PORT|g" .env.local
    fi
    echo "✓ .env.localのAPI_BASE_URLをポート$PORTに更新しました"
fi
```

### 15. 開発サーバーの起動

```bash
# バックグラウンドで開発サーバーを起動
echo "開発サーバーをポート$PORTで起動しています..."
pnpm dev --port $PORT &
DEV_SERVER_PID=$!
echo "✓ 開発サーバーを起動しました (PID: $DEV_SERVER_PID, ポート: $PORT)"
echo "  URL: http://localhost:$PORT"
```

**注意**: 開発サーバーはBashツールの `run_in_background` オプションを使用してバックグラウンドで起動します。

### 16. VSCodeで開く

```bash
# worktreeディレクトリをVSCodeで開く
code .
echo "✓ VSCodeでworktreeを開きました"
```

### 17. ルートディレクトリに戻る

```bash
# リポジトリのルートディレクトリに戻る
cd "$REPO_ROOT"
echo "✓ ルートディレクトリに戻りました: $REPO_ROOT"
```

## Additional Features

### worktreeの一覧表示

実装後、ユーザーに以下のコマンドで既存のworktreeを確認できることを伝える：

```bash
git worktree list
```

### worktreeの削除方法

作業完了後のクリーンアップ方法を伝える：

```bash
# worktreeを削除
git worktree remove worktree/[task-name]

# ブランチをマージ後に削除
git branch -d worktree/[task-name]
```

## Error Handling

以下のエラーケースに対応：

1. **タスク名が空**: ユーザーに質問して取得
2. **gitリポジトリではない**: "エラー: このディレクトリはgitリポジトリではありません"
3. **ブランチ名の競合**: ユーザーに選択を促す
4. **worktree作成失敗**: 詳細なエラーメッセージを表示
5. **VSCode未インストール**: code コマンドが使えない場合は手動で開くよう指示
6. **GitHub Issue作成失敗**: エラーメッセージを表示するが、worktree作成は継続
7. **pnpm install失敗**: エラーメッセージを表示し、手動でのインストールを促す
8. **.env.exampleが存在しない**: 警告を表示してスキップ
9. **利用可能なポートが見つからない**: デフォルトポート3000を使用
10. **開発サーバー起動失敗**: エラーメッセージを表示するが、VSCodeは開く

## Output Format

**成功時の出力例（Issue作成なし）:**

```
✓ タスク名を英訳しました: "ユーザー認証機能" → "user-authentication-feature"
✓ 現在のブランチ 'main' をベースにします
✓ ブランチ名: worktree/user-authentication-feature
✓ worktreeを作成しました: /path/to/repo/worktree/user-authentication-feature

✓ worktreeディレクトリに移動しました
✓ 依存パッケージのインストールが完了しました
✓ .env.localを作成しました
✓ 利用可能なポートを見つけました: 3001
✓ .env.localのAPI_BASE_URLをポート3001に更新しました
✓ 開発サーバーを起動しました (ポート: 3001)
  URL: http://localhost:3001

=== Worktree環境のセットアップが完了しました ===

ベースブランチ: main
ブランチ名: worktree/user-authentication-feature
作業ディレクトリ: /path/to/repo/worktree/user-authentication-feature
開発サーバー: http://localhost:3001

VSCodeで開いています...
✓ ルートディレクトリに戻りました
```

**成功時の出力例（Issue作成あり）:**

```
✓ タスク名を英訳しました: "ユーザー認証機能" → "user-authentication-feature"
✓ 現在のブランチ 'develop' をベースにします
✓ ブランチ名: worktree/user-authentication-feature
✓ worktreeを作成しました: /path/to/repo/worktree/user-authentication-feature

✓ GitHub Issueを作成しました: #123
  URL: https://github.com/owner/repo/issues/123

✓ worktreeディレクトリに移動しました
✓ 依存パッケージのインストールが完了しました
✓ .env.localを作成しました
✓ 利用可能なポートを見つけました: 3002
✓ .env.localのAPI_BASE_URLをポート3002に更新しました
✓ 開発サーバーを起動しました (ポート: 3002)
  URL: http://localhost:3002

=== Worktree環境のセットアップが完了しました ===

ベースブランチ: develop
ブランチ名: worktree/user-authentication-feature
作業ディレクトリ: /path/to/repo/worktree/user-authentication-feature
開発サーバー: http://localhost:3002

VSCodeで開いています...
✓ ルートディレクトリに戻りました
```

## Notes

- worktreeは同じリポジトリの異なるブランチを同時にチェックアウトできる機能です
- 各worktreeは独立した作業ディレクトリを持ちます
- メインの作業ディレクトリに影響を与えずに複数のタスクを並行して進められます
- worktreeディレクトリは .gitignore に追加することを推奨
- 各worktreeは独自のポートで開発サーバーを起動するため、複数のworktreeを同時に実行可能
- 開発サーバーはバックグラウンドで起動されるため、作業終了時は手動で停止が必要
- 開発サーバーの停止: `lsof -i :[PORT] | grep LISTEN | awk '{print $2}' | xargs kill`
