#!/bin/bash

# Git Worktree Management Helper Script
# worktreeの作成、削除、一覧表示を行うヘルパースクリプト

set -e

# 色の定義
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# リポジトリのルートディレクトリを取得
REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null)
if [ -z "$REPO_ROOT" ]; then
    echo -e "${RED}エラー: gitリポジトリではありません${NC}"
    exit 1
fi

# worktreeのベースディレクトリ
WORKTREE_BASE="$REPO_ROOT/worktree"

# ヘルプメッセージ
show_help() {
    cat << EOF
Git Worktree Management Helper

使用方法:
    $(basename "$0") <command> [options]

コマンド:
    create <task-name>    新しいworktreeを作成
    list                  既存のworktreeを一覧表示
    remove <task-name>    worktreeを削除
    clean                 マージ済みのworktreeをクリーンアップ
    help                  このヘルプを表示

例:
    $(basename "$0") create user-auth
    $(basename "$0") list
    $(basename "$0") remove user-auth
    $(basename "$0") clean

EOF
}

# タスク名をケバブケースに変換
to_kebab_case() {
    local input="$1"
    echo "$input" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//;s/-$//'
}

# worktreeを作成
create_worktree() {
    local task_name="$1"

    if [ -z "$task_name" ]; then
        echo -e "${RED}エラー: タスク名を指定してください${NC}"
        echo "使用方法: $(basename "$0") create <task-name>"
        exit 1
    fi

    # タスク名をケバブケースに変換
    local task_name_kebab=$(to_kebab_case "$task_name")
    local branch_name="worktree/$task_name_kebab"
    local worktree_path="$WORKTREE_BASE/$task_name_kebab"

    echo -e "${BLUE}=== Worktree作成 ===${NC}"
    echo ""

    # worktreeベースディレクトリの作成
    if [ ! -d "$WORKTREE_BASE" ]; then
        mkdir -p "$WORKTREE_BASE"
        echo -e "${GREEN}✓${NC} worktreeディレクトリを作成: $WORKTREE_BASE"
    fi

    # ブランチの存在確認
    if git show-ref --verify --quiet "refs/heads/$branch_name"; then
        echo -e "${YELLOW}⚠${NC} ブランチ '$branch_name' は既に存在します"
        read -p "既存のブランチを使用しますか？ (y/n): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "処理を中止しました"
            exit 0
        fi

        # 既存ブランチでworktreeを作成
        git worktree add "$worktree_path" "$branch_name"
    else
        # 新しいブランチでworktreeを作成
        echo -e "${GREEN}✓${NC} 新しいブランチを作成: $branch_name"
        git worktree add -b "$branch_name" "$worktree_path"
    fi

    echo ""
    echo -e "${GREEN}=== Worktree環境のセットアップが完了しました ===${NC}"
    echo ""
    echo -e "${BLUE}ブランチ名:${NC} $branch_name"
    echo -e "${BLUE}作業ディレクトリ:${NC} $worktree_path"
    echo ""
    echo "利用可能なコマンド:"
    echo "  cd $worktree_path    # worktreeに移動"
    echo "  code $worktree_path  # VSCodeで開く"
    echo ""

    # VSCodeで開くか確認
    read -p "VSCodeで開きますか？ (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if command -v code &> /dev/null; then
            cd "$worktree_path"
            code .
            echo -e "${GREEN}✓${NC} VSCodeで開きました"
        else
            echo -e "${YELLOW}⚠${NC} code コマンドが見つかりません"
            echo "手動で開いてください: code $worktree_path"
        fi
    fi
}

# worktreeの一覧を表示
list_worktrees() {
    echo -e "${BLUE}=== Worktree一覧 ===${NC}"
    echo ""

    if [ ! -d "$WORKTREE_BASE" ]; then
        echo "worktreeディレクトリが存在しません"
        return
    fi

    # git worktree listの出力を解析
    git worktree list | grep "$WORKTREE_BASE" || echo "worktreeが見つかりません"
}

# worktreeを削除
remove_worktree() {
    local task_name="$1"

    if [ -z "$task_name" ]; then
        echo -e "${RED}エラー: タスク名を指定してください${NC}"
        echo "使用方法: $(basename "$0") remove <task-name>"
        exit 1
    fi

    local task_name_kebab=$(to_kebab_case "$task_name")
    local branch_name="worktree/$task_name_kebab"
    local worktree_path="$WORKTREE_BASE/$task_name_kebab"

    echo -e "${BLUE}=== Worktree削除 ===${NC}"
    echo ""

    # worktreeが存在するか確認
    if [ ! -d "$worktree_path" ]; then
        echo -e "${YELLOW}⚠${NC} worktreeが見つかりません: $worktree_path"
        exit 1
    fi

    # 確認
    echo -e "${YELLOW}警告: 以下のworktreeを削除します${NC}"
    echo "ブランチ: $branch_name"
    echo "ディレクトリ: $worktree_path"
    echo ""
    read -p "本当に削除しますか？ (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "処理を中止しました"
        exit 0
    fi

    # worktreeを削除
    git worktree remove "$worktree_path"
    echo -e "${GREEN}✓${NC} worktreeを削除しました"

    # ブランチも削除するか確認
    if git show-ref --verify --quiet "refs/heads/$branch_name"; then
        read -p "ブランチ '$branch_name' も削除しますか？ (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            # マージ済みかチェック
            if git branch --merged | grep -q "$branch_name"; then
                git branch -d "$branch_name"
                echo -e "${GREEN}✓${NC} ブランチを削除しました"
            else
                echo -e "${YELLOW}⚠${NC} ブランチはまだマージされていません"
                read -p "強制削除しますか？ (y/n): " -n 1 -r
                echo
                if [[ $REPLY =~ ^[Yy]$ ]]; then
                    git branch -D "$branch_name"
                    echo -e "${GREEN}✓${NC} ブランチを強制削除しました"
                else
                    echo "ブランチは保持されます"
                fi
            fi
        fi
    fi
}

# マージ済みのworktreeをクリーンアップ
clean_worktrees() {
    echo -e "${BLUE}=== Worktreeクリーンアップ ===${NC}"
    echo ""

    if [ ! -d "$WORKTREE_BASE" ]; then
        echo "worktreeディレクトリが存在しません"
        return
    fi

    # マージ済みのworktreeブランチを検索
    local merged_branches=$(git branch --merged | grep "worktree/" | sed 's/^[* ]*//')

    if [ -z "$merged_branches" ]; then
        echo "クリーンアップするworktreeがありません"
        return
    fi

    echo "以下のマージ済みworktreeが見つかりました:"
    echo "$merged_branches"
    echo ""

    read -p "これらのworktreeを削除しますか？ (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "処理を中止しました"
        exit 0
    fi

    # 各ブランチのworktreeを削除
    while IFS= read -r branch; do
        local task_name="${branch#worktree/}"
        local worktree_path="$WORKTREE_BASE/$task_name"

        if [ -d "$worktree_path" ]; then
            git worktree remove "$worktree_path" 2>/dev/null || true
            echo -e "${GREEN}✓${NC} worktreeを削除: $task_name"
        fi

        git branch -d "$branch" 2>/dev/null || true
        echo -e "${GREEN}✓${NC} ブランチを削除: $branch"
    done <<< "$merged_branches"

    echo ""
    echo -e "${GREEN}クリーンアップが完了しました${NC}"
}

# メイン処理
case "${1:-}" in
    create)
        create_worktree "$2"
        ;;
    list)
        list_worktrees
        ;;
    remove)
        remove_worktree "$2"
        ;;
    clean)
        clean_worktrees
        ;;
    help|--help|-h|"")
        show_help
        ;;
    *)
        echo -e "${RED}エラー: 不明なコマンド: $1${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac
