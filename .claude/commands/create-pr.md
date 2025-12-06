---
description: 現在のブランチの変更をプッシュし、分岐元ブランチに対してPRを作成します
---

# Create Pull Request

現在のブランチの変更をプッシュし、PRを作成してください。

## Step 1: 現在の状態を確認

以下のコマンドを実行して状態を把握：

```bash
# 現在のブランチ名
git branch --show-current

# リモートの確認
git remote -v

# 未コミットの変更があるか確認
git status
```

## Step 2: 分岐元ブランチの特定

以下の手順で分岐元ブランチを特定してください：

### 方法1: 上流ブランチ（tracking branch）を確認

```bash
git rev-parse --abbrev-ref --symbolic-full-name @{upstream} 2>/dev/null
```

→ 設定されていればこれが分岐元の候補

### 方法2: 全リモートブランチとの距離を計算

```bash
# リモートブランチ一覧を取得
git fetch --all --prune

# 各リモートブランチとの分岐点とコミット数を計算
for branch in $(git branch -r | grep -v HEAD); do
  merge_base=$(git merge-base HEAD "$branch" 2>/dev/null)
  if [ -n "$merge_base" ]; then
    ahead=$(git rev-list --count "$merge_base"..HEAD 2>/dev/null)
    echo "$ahead commits ahead of $branch (merge-base: $merge_base)"
  fi
done | sort -n | head -10
```

**判定ロジック**:

1. コミット数が最も少ない（=最も近い）ブランチを分岐元候補とする
2. 同数の場合は以下の優先順位で選択:
   - `main` > `master` > `develop` > `release/*` > その他

### 方法3: reflog から分岐元を推測

```bash
# ブランチ作成時のログを確認
git reflog show --no-abbrev $(git branch --show-current) | head -5
```

→ `branch: Created from <branch>` の形式で分岐元が記録されている場合がある

### 判定結果の確認

分岐元ブランチが特定できたら、ユーザーに確認：

- 「分岐元ブランチは `<detected-branch>` でよろしいですか？」
- 複数候補がある場合は選択肢を提示

**確定後、差分を確認**:

```bash
# 分岐元からの差分（コミット一覧）
git log --oneline <base-branch>..HEAD

# 分岐元からのファイル差分
git diff --stat <base-branch>..HEAD
```

## Step 3: 未プッシュのコミットをプッシュ

```bash
# 現在のブランチをリモートにプッシュ（上流ブランチ設定）
git push -u origin <現在のブランチ名>
```

**注意**:

- コミットされていない変更がある場合は、ユーザーに確認してからコミットするか判断
- プッシュ前に `git status` で状態を確認

## Step 4: 差分を分析してPR内容を生成

差分の内容を分析し、以下を生成：

### PRタイトル

- 変更の主な目的を簡潔に表現（50文字以内推奨）
- 形式: `<type>: <description>`
  - feat: 新機能
  - fix: バグ修正
  - refactor: リファクタリング
  - docs: ドキュメント
  - test: テスト追加・修正
  - chore: その他

### PR本文

以下の形式で生成：

```markdown
## 概要

[この変更の目的と背景を1-2文で]

## 変更内容

- [主な変更点1]
- [主な変更点2]
- [主な変更点3]

## 技術的な詳細

[実装のアプローチや注意点があれば]

## テスト

- [ ] 単体テスト
- [ ] 動作確認

## スクリーンショット

[UIの変更がある場合]
```

## Step 5: PRを作成

`mcp__github__create_pull_request` を使用してPRを作成：

- **owner**: リモートURLから抽出（例: `tomoki`）
- **repo**: リモートURLから抽出（例: `bloomo-task`）
- **title**: Step 4で生成したタイトル
- **body**: Step 4で生成した本文
- **head**: 現在のブランチ名
- **base**: Step 2で特定した分岐元ブランチ

## Step 6: 結果を報告

PRが作成されたら、以下を報告：

- PR URL
- PRタイトル
- ベースブランチ → ヘッドブランチ

---

## 注意事項

- **未コミットの変更がある場合**: ユーザーに確認してからコミットを行う
- **分岐元ブランチの特定**: 必ずユーザーに確認を取ってから決定する
- **コンフリクトの可能性**: ベースブランチとの差分が大きい場合は警告
- **リモートブランチが存在しない場合**: `git push -u origin <branch>` で作成してからPR作成
