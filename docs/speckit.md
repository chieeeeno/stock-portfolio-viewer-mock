# Speckit - 機能仕様駆動開発ワークフロー

Speckitは、機能仕様の作成から実装までの完全なワークフローを提供するシステムです。Claude Codeと統合され、自然言語から実装可能なタスクまで、段階的に仕様を具体化していきます。

## 特徴

- 📝 **自然言語から仕様へ**: 簡単な説明から詳細な機能仕様を自動生成
- 🔍 **対話的な明確化**: 曖昧な部分を質問形式で段階的に明確化
- 🏗️ **技術的計画**: アーキテクチャとデータモデルの設計
- ✅ **タスク分解**: 依存関係を考慮した実装可能なタスクリスト
- 🤖 **自動実装**: タスクに基づいた段階的な実装支援
- 📊 **品質チェック**: 仕様、計画、タスクの整合性分析
- 🔀 **並列作業環境**: git worktreeを使った複数タスクの同時進行

## セットアップ

### 1. このリポジトリをテンプレートとして使用

既存のプロジェクトにspeckitをセットアップする場合:

```bash
# このリポジトリをクローン
git clone https://github.com/chieeeeno/claude-speckit-starter.git
cd claude-speckit-starter

# あなたのプロジェクトディレクトリで実行
./setup-speckit.sh
```

オプション:
- `--force`: 既存のファイルを上書き
- `--dry-run`: 何が行われるかを確認（実際にはコピーしない）
- `--help`: ヘルプを表示

### 2. 直接このリポジトリを使用

```bash
git clone https://github.com/chieeeeno/claude-speckit-starter.git
cd claude-speckit-starter
```

## ワークフロー

### 1. プロジェクト憲法の設定（オプション）

プロジェクトの原則やルールを定義します：

```bash
# Claude Codeで実行
/speckit.constitution
```

憲法には以下を定義できます：
- コーディング標準
- アーキテクチャ原則
- テスト戦略
- セキュリティ要件

### 2. 機能仕様の作成

自然言語で機能を説明します：

```bash
# Claude Codeで実行
/speckit.specify ユーザーが商品をカートに追加できる機能を作りたい
```

このコマンドは以下を生成します：
- `specs/N-feature-name/spec.md`: 機能仕様書
- 新しいGitブランチ（例: `1-add-to-cart`）

生成される仕様書には以下が含まれます：
- 機能の概要
- ユーザーストーリー
- 機能要件
- 成功基準
- エッジケース

### 3. 仕様の明確化（オプション）

不明確な部分を対話的に明確化します：

```bash
/speckit.clarify
```

最大5つの質問を通じて仕様を具体化します。

### 4. 実装計画の作成

技術的な実装計画を生成します：

```bash
/speckit.plan 使用技術: Next.js, TypeScript, PostgreSQL
```

生成される成果物：
- `specs/N-feature-name/plan.md`: 実装計画
- `specs/N-feature-name/data-model.md`: データモデル
- `specs/N-feature-name/contracts/`: API仕様
- `specs/N-feature-name/research.md`: 技術調査結果

### 5. チェックリストの生成（オプション）

品質確認用のチェックリストを作成します：

```bash
/speckit.checklist UX
```

チェックリストタイプの例：
- `ux`: UX要件の品質確認
- `api`: API仕様の品質確認
- `security`: セキュリティ要件の品質確認
- `performance`: パフォーマンス要件の品質確認

### 6. タスクの生成

実装可能なタスクリストを生成します：

```bash
/speckit.tasks
```

生成される `tasks.md` には以下が含まれます：
- フェーズ分けされたタスク
- 依存関係の明示
- 並列実行可能なタスクの識別
- ファイルパスの指定

### 7. 整合性分析（オプション）

仕様、計画、タスクの整合性を分析します：

```bash
/speckit.analyze
```

検出される問題：
- 重複する要件
- 曖昧な表現
- カバレッジの欠落
- 憲法違反
- 用語の不一致

### 8. 実装

タスクに基づいて実装を進めます：

```bash
/speckit.implement
```

このコマンドは：
1. チェックリストの完了状態を確認
2. タスクを順番に実行
3. TDD（テスト駆動開発）アプローチをサポート
4. フェーズごとに検証

### 9. GitHub Issueへの変換（オプション）

タスクをGitHub Issueに変換します：

```bash
/speckit.taskstoissues
```

## ディレクトリ構造

```
.
├── .claude/
│   └── commands/
│       ├── speckit.analyze.md        # 整合性分析コマンド
│       ├── speckit.checklist.md      # チェックリスト生成コマンド
│       ├── speckit.clarify.md        # 明確化コマンド
│       ├── speckit.constitution.md   # 憲法管理コマンド
│       ├── speckit.implement.md      # 実装コマンド
│       ├── speckit.plan.md           # 計画作成コマンド
│       ├── speckit.specify.md        # 仕様作成コマンド
│       ├── speckit.tasks.md          # タスク生成コマンド
│       └── speckit.taskstoissues.md  # Issue変換コマンド
│
├── .specify/
│   ├── memory/
│   │   └── constitution.md           # プロジェクト憲法
│   ├── scripts/
│   │   └── bash/
│   │       ├── check-prerequisites.sh    # 前提条件チェック
│   │       ├── common.sh                 # 共通関数
│   │       ├── create-new-feature.sh     # 新機能ブランチ作成
│   │       ├── setup-plan.sh             # 計画セットアップ
│   │       └── update-agent-context.sh   # コンテキスト更新
│   └── templates/
│       ├── agent-file-template.md    # エージェント設定テンプレート
│       ├── checklist-template.md     # チェックリストテンプレート
│       ├── plan-template.md          # 計画テンプレート
│       ├── spec-template.md          # 仕様テンプレート
│       └── tasks-template.md         # タスクテンプレート
│
├── specs/                            # 機能ごとの仕様ディレクトリ
│   └── N-feature-name/
│       ├── spec.md                   # 機能仕様書
│       ├── plan.md                   # 実装計画
│       ├── tasks.md                  # タスクリスト
│       ├── data-model.md             # データモデル
│       ├── research.md               # 技術調査
│       ├── contracts/                # API仕様
│       └── checklists/               # チェックリスト
│
├── worktree/                         # git worktree作業ディレクトリ（自動生成）
│   └── [task-name]/                  # タスクごとの独立した作業環境
│
├── setup-speckit.sh                  # セットアップスクリプト
└── README.md                         # このファイル
```

## Git Worktreeによる並列作業

複数のタスクを同時に進めたい場合、git worktreeを使って独立した作業環境を作成できます。

### タスク環境の作成

```bash
# Claude Codeで実行
/task-start ユーザー認証機能
```

このコマンドは以下を実行します：
1. タスク名を英訳（例: "ユーザー認証機能" → "user-authentication-feature"）
2. `worktree/user-authentication-feature` ブランチを作成
3. `/worktree/user-authentication-feature/` ディレクトリに作業環境を作成
4. VSCodeで新しい作業環境を開く

### Worktree管理コマンド

直接スクリプトを使用することもできます：

```bash
# worktreeを作成
./.specify/scripts/bash/manage-worktree.sh create task-name

# worktreeの一覧表示
./.specify/scripts/bash/manage-worktree.sh list

# worktreeを削除
./.specify/scripts/bash/manage-worktree.sh remove task-name

# マージ済みのworktreeをクリーンアップ
./.specify/scripts/bash/manage-worktree.sh clean
```

### Worktreeの利点

- **独立した環境**: 各タスクが完全に独立した作業ディレクトリを持つ
- **素早い切り替え**: ブランチの切り替えなしで複数のタスクを並行作業
- **安全な実験**: メインの作業環境に影響を与えずに試行錯誤可能
- **レビュー作業**: PRレビュー中も別のタスクを進められる

### 注意事項

- worktreeディレクトリは `.gitignore` で無視されます
- 作業完了後は `manage-worktree.sh remove` でクリーンアップしましょう
- 同じブランチを複数のworktreeでチェックアウトすることはできません

## コマンド一覧

| コマンド | 説明 | 前提条件 |
|---------|------|---------|
| `/speckit.constitution` | プロジェクト憲法を作成・更新 | なし |
| `/speckit.specify` | 機能仕様を作成 | なし |
| `/speckit.clarify` | 仕様の不明確な部分を明確化 | spec.md |
| `/speckit.plan` | 実装計画を作成 | spec.md |
| `/speckit.checklist` | チェックリストを生成 | spec.md |
| `/speckit.tasks` | タスクリストを生成 | plan.md |
| `/speckit.analyze` | 整合性を分析 | tasks.md |
| `/speckit.implement` | 実装を実行 | tasks.md |
| `/speckit.taskstoissues` | タスクをGitHub Issueに変換 | tasks.md |
| `/task-start` | git worktreeで新しいタスク環境を作成 | なし |

## 使用例

### ケース1: 新しい認証機能の追加

```bash
# 1. 仕様作成
/speckit.specify OAuth2を使ったソーシャルログイン機能

# 2. 不明確な部分を明確化
/speckit.clarify

# 3. 実装計画
/speckit.plan 使用技術: Next.js, NextAuth.js, PostgreSQL

# 4. セキュリティチェックリスト
/speckit.checklist security

# 5. タスク生成
/speckit.tasks

# 6. 実装
/speckit.implement
```

### ケース2: 既存機能の改善

```bash
# 1. 改善内容を仕様化
/speckit.specify 検索機能のパフォーマンス改善

# 2. 技術調査と計画
/speckit.plan

# 3. パフォーマンスチェックリスト
/speckit.checklist performance

# 4. タスク生成と実装
/speckit.tasks
/speckit.implement
```

## ベストプラクティス

### 1. 小さく始める

最初は簡単な機能から始めて、ワークフローに慣れましょう。

### 2. 憲法は早めに設定

プロジェクトの原則を早めに定義しておくと、一貫性のある設計が可能です。

### 3. 明確化を怠らない

仕様の曖昧さは後で大きな手戻りにつながります。`/speckit.clarify`を活用しましょう。

### 4. チェックリストで品質を担保

実装前にチェックリストで要件の完全性を確認しましょう。

### 5. フェーズごとに検証

タスクをフェーズごとに実装し、各フェーズで動作確認を行いましょう。

## トラブルシューティング

### Q: セットアップスクリプトが動かない

```bash
# 実行権限を確認
ls -la setup-speckit.sh

# 実行権限がない場合
chmod +x setup-speckit.sh
```

### Q: コマンドが見つからない

Claude Codeで `.claude/commands/` ディレクトリが正しく認識されているか確認してください。

### Q: 既存のファイルを上書きしたい

```bash
./setup-speckit.sh --force
```

### Q: 何がコピーされるか確認したい

```bash
./setup-speckit.sh --dry-run
```

## カスタマイズ

### テンプレートのカスタマイズ

`.specify/templates/` 内のテンプレートを編集することで、生成される成果物の形式を変更できます。

### スクリプトの拡張

`.specify/scripts/bash/` 内のスクリプトを拡張することで、独自のワークフローを追加できます。

### 憲法のカスタマイズ

`.specify/memory/constitution.md` を編集して、プロジェクト固有の原則を定義できます。

## ライセンス

このプロジェクトのライセンスについては、LICENSEファイルを参照してください。

## 貢献

バグ報告や機能提案は、GitHubのIssueでお願いします。

## リンク

- [Claude Code](https://claude.com/claude-code)
- [GitHubリポジトリ](https://github.com/chieeeeno/claude-speckit-starter)
