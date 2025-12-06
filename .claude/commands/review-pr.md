---
description: GitHub PRのURLからコードレビューを実施し、レビューコメントを投稿します
argument-hint: <pr-url>
---

# PR Code Review

**引数で渡されたPR URL**: `$ARGUMENTS`

## タスク

指定されたGitHub PR URLを解析し、包括的なコードレビューを実施してください。

### Step 1: PR URLの解析

URLから以下を抽出してください：
- owner（リポジトリオーナー）
- repo（リポジトリ名）
- pull_number（PR番号）

URL形式: `https://github.com/{owner}/{repo}/pull/{pull_number}`

### Step 2: PR情報の取得

GitHub MCPツールを使用して以下を取得：
1. `mcp__github__get_pull_request` - PR詳細（タイトル、説明、ベースブランチ等）
2. `mcp__github__get_pull_request_files` - 変更されたファイル一覧と差分

### Step 3: コードレビュー実施

以下の観点で各変更ファイルをレビューしてください：

#### 🐛 バグ・ロジックエラー
- Null/undefined参照の可能性
- 境界値の処理漏れ
- 例外処理の不備
- 競合状態やレースコンディション

#### 🔒 セキュリティ
- インジェクション脆弱性（SQL, XSS, コマンド等）
- 認証・認可の不備
- 機密情報の露出
- 入力値の検証不足

#### ⚡ パフォーマンス
- N+1問題
- 不要な再レンダリング（React）
- メモリリーク
- 非効率なアルゴリズム

#### 📖 可読性・保守性
- 命名規則の一貫性
- 過度な複雑性
- マジックナンバー
- ドキュメント・コメントの不足

#### 📏 プロジェクトガイドライン準拠（CLAUDE.md参照）

**コードスタイル**:
- シングルクォートを使用しているか（ダブルクォート不可）
- セミコロンを使用しているか
- 2スペースインデントか
- 100文字以内の行幅か
- ES5スタイルのトレイリングカンマか

**プロジェクト構造**:
- 新規ファイルが正しいディレクトリに配置されているか
  - コンポーネント → `src/components/`
  - 型定義 → `src/types/`
  - ユーティリティ → `src/utils/`
  - モックデータ → `src/data/`
- テストファイルがソースと同階層に配置されているか（co-located）
- テストファイル命名が `*.test.ts` または `*.test.tsx` か

**技術スタック準拠**:
- Next.js App Router のパターンに従っているか
- TypeScriptの型が適切に定義されているか（any使用の回避）
- Tailwind CSSでのスタイリングか（インラインstyle回避）

### Step 4: レビュー結果の投稿

`mcp__github__create_pull_request_review`を使用してPRにレビューを投稿してください。

**レビュー投稿形式**:
- 問題がなければ: `event: "APPROVE"`
- 軽微な指摘のみ: `event: "COMMENT"`
- 修正が必要: `event: "REQUEST_CHANGES"`

**bodyの形式**:
```markdown
## Code Review Summary

### 総評
[全体的な評価を1-2文で]

### 発見した問題
[問題がある場合は箇条書きで。ない場合は「特になし」]

### 良い点
[良いコードがあれば言及]

---
🤖 Reviewed by Claude Code
```

### 注意事項
- 各ファイルの差分を丁寧に読み、具体的な行番号を指摘に含める
- 重箱の隅をつつくような指摘は避け、実質的な問題に焦点を当てる
- 建設的なフィードバックを心がける
