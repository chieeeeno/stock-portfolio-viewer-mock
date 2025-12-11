---
description: 作業していたworktreeとそのブランチを削除します。
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Goal

git worktreeと関連するブランチを安全に削除し、作業環境をクリーンアップします。

## Execution Steps

**重要**: 以下の2箇所のみユーザーに質問し、それ以外は確認なしで自動実行します：
1. 削除対象のworktree選択
2. 未コミット変更がある場合の確認

### 1. worktree一覧の取得と削除対象の選択

```bash
git worktree list
```

このコマンドを実行して、worktree一覧から削除対象を選択してもらいます。

- メインのworktree（bare: や `.git` を含むもの）は選択肢から除外
- `worktree/` プレフィックスを持つworktreeのみを選択肢として表示
- 各選択肢にはworktreeのパスとブランチ名を表示

**AskUserQuestionツールで質問:**
```
質問: "削除するworktreeを選択してください:"
  選択肢:
    - worktree/task-name-1 (branch: worktree/task-name-1)
    - worktree/task-name-2 (branch: worktree/task-name-2)
    - ...
```

**worktreeが存在しない場合:**
"削除可能なworktreeが見つかりません。" と表示して処理を終了します。

### 2. 未コミット変更の確認

選択されたworktreeディレクトリで以下を実行：

```bash
cd [WORKTREE_PATH]
git status --porcelain
```

**未コミットの変更がある場合:**

AskUserQuestionツールで確認：

```
質問: "⚠️ 未コミットの変更があります。削除を続行しますか？"
  選択肢:
    - Yes: 変更を破棄して削除を続行
    - No: 削除をキャンセル
```

変更内容の概要を表示：
```
未コミットの変更:
  M src/components/Example.tsx
  ?? src/utils/newFile.ts
  ...
```

**「No」を選択した場合:**
```
メッセージ: "削除をキャンセルしました。"
```
処理を終了します。

### 3. worktreeの削除（自動実行）

```bash
# メインリポジトリのディレクトリに戻る
REPO_ROOT=$(git rev-parse --show-toplevel)
cd "$REPO_ROOT"

# worktreeを削除（強制削除）
git worktree remove --force [WORKTREE_PATH]
```

### 4. ブランチの削除（自動実行）

```bash
# ブランチを強制削除
git branch -D [BRANCH_NAME]
```

**注意:**
- `-D` オプションを使用してマージ状態に関係なく削除
- ブランチが既に削除されている場合はスキップ

### 5. 完了メッセージの表示

```
=== Worktree環境を削除しました ===

削除されたworktree: [WORKTREE_PATH]
削除されたブランチ: [BRANCH_NAME]

残りのworktree一覧:
[git worktree list の結果]
```

## Error Handling

以下のエラーケースに対応：

1. **gitリポジトリではない**: "エラー: このディレクトリはgitリポジトリではありません"
2. **worktreeが存在しない**: "削除可能なworktreeが見つかりません。"
3. **worktree削除失敗**: 詳細なエラーメッセージを表示
4. **ブランチ削除失敗**: エラーを表示するが、worktree削除は成功として扱う

## Output Format

**成功時の出力例:**

```
✓ worktree一覧を取得しました

現在のworktree:
  /path/to/repo (main)
  /path/to/repo/worktree/user-auth (worktree/user-auth)
  /path/to/repo/worktree/bug-fix (worktree/bug-fix)

[ユーザーが "worktree/user-auth" を選択]

✓ 未コミットの変更はありません
✓ worktreeを削除しました: /path/to/repo/worktree/user-auth
✓ ブランチを削除しました: worktree/user-auth

=== Worktree環境を削除しました ===

削除されたworktree: /path/to/repo/worktree/user-auth
削除されたブランチ: worktree/user-auth

残りのworktree一覧:
  /path/to/repo (main)
  /path/to/repo/worktree/bug-fix (worktree/bug-fix)
```

**未コミット変更がある場合の出力例:**

```
✓ worktree一覧を取得しました

[ユーザーが選択]

⚠️ 未コミットの変更があります:
  M src/components/Example.tsx
  ?? src/utils/newFile.ts

[ユーザーが "Yes" を選択]

✓ worktreeを削除しました（変更は破棄されました）
✓ ブランチを削除しました: worktree/user-auth

=== Worktree環境を削除しました ===
...
```

## Notes

- worktreeを削除すると、そのディレクトリ内のすべてのファイルが削除されます
- ブランチも同時に削除されるため、必要な変更は事前にコミット・プッシュしてください
- メインのworktree（リポジトリ本体）は削除できません
