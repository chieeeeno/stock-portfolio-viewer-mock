#!/bin/bash

# Speckit Setup Script
# このスクリプトは、プロジェクトにspeckitワークフローシステムをセットアップします。

set -e

# 色の定義
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# ヘルプメッセージ
show_help() {
    cat << EOF
Speckit Setup Script

使用方法:
    ./setup-speckit.sh [オプション]

オプション:
    -h, --help          このヘルプメッセージを表示
    -f, --force         既存のファイルを上書き
    -d, --dry-run       実際にファイルをコピーせず、何が行われるかを表示

説明:
    このスクリプトは、以下のファイルとディレクトリをプロジェクトにセットアップします:
    - .claude/commands/speckit.*.md (Claudeコマンド)
    - .specify/templates/ (テンプレートファイル)
    - .specify/scripts/ (ユーティリティスクリプト)
    - .specify/memory/constitution.md (プロジェクト憲法)

例:
    ./setup-speckit.sh                # 通常のセットアップ
    ./setup-speckit.sh --force        # 既存ファイルを上書き
    ./setup-speckit.sh --dry-run      # 何が行われるかを確認

EOF
}

# 引数のパース
FORCE=false
DRY_RUN=false

while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -f|--force)
            FORCE=true
            shift
            ;;
        -d|--dry-run)
            DRY_RUN=true
            shift
            ;;
        *)
            echo -e "${RED}エラー: 不明なオプション: $1${NC}"
            show_help
            exit 1
            ;;
    esac
done

# スクリプトのディレクトリを取得
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo -e "${BLUE}=== Speckit セットアップ ===${NC}"
echo ""

# 対象ディレクトリの確認
if [ "$DRY_RUN" = true ]; then
    echo -e "${YELLOW}[DRY RUN モード] 実際にファイルはコピーされません${NC}"
    echo ""
fi

# コピーするファイルとディレクトリのリスト
COPY_ITEMS=(
    ".claude/commands:Claudeコマンド"
    ".specify/templates:テンプレートファイル"
    ".specify/scripts:ユーティリティスクリプト"
    ".specify/memory:プロジェクト憲法"
)

# 各アイテムをコピー
for entry in "${COPY_ITEMS[@]}"; do
    item="${entry%%:*}"
    description="${entry#*:}"
    src="$SCRIPT_DIR/$item"

    # .claude/commands の場合は speckit.* のみコピー
    if [ "$item" = ".claude/commands" ]; then
        echo -e "${GREEN}✓${NC} ${description} をセットアップ中..."

        if [ "$DRY_RUN" = false ]; then
            mkdir -p ".claude/commands"
        fi

        for file in "$src"/speckit.*.md; do
            if [ -f "$file" ]; then
                filename=$(basename "$file")
                dest=".claude/commands/$filename"

                if [ -f "$dest" ] && [ "$FORCE" = false ]; then
                    echo -e "  ${YELLOW}⚠${NC}  $filename はすでに存在します (スキップ)"
                else
                    if [ "$DRY_RUN" = false ]; then
                        cp "$file" "$dest"
                        echo -e "  ${GREEN}✓${NC}  $filename をコピーしました"
                    else
                        echo -e "  ${BLUE}→${NC}  $filename をコピーします"
                    fi
                fi
            fi
        done
    else
        # その他のディレクトリはそのままコピー
        if [ -d "$src" ]; then
            echo -e "${GREEN}✓${NC} ${description} をセットアップ中..."

            dest_dir=$(dirname "$item")
            if [ "$DRY_RUN" = false ]; then
                mkdir -p "$dest_dir"

                if [ -d "$item" ] && [ "$FORCE" = false ]; then
                    echo -e "  ${YELLOW}⚠${NC}  $item はすでに存在します (スキップ)"
                else
                    cp -r "$src" "$item"
                    echo -e "  ${GREEN}✓${NC}  $item をコピーしました"
                fi
            else
                echo -e "  ${BLUE}→${NC}  $item をコピーします"
            fi
        else
            echo -e "${YELLOW}⚠${NC} ${description} が見つかりません: $src"
        fi
    fi
    echo ""
done

# スクリプトに実行権限を付与
if [ "$DRY_RUN" = false ]; then
    if [ -d ".specify/scripts/bash" ]; then
        chmod +x .specify/scripts/bash/*.sh
        echo -e "${GREEN}✓${NC} スクリプトに実行権限を付与しました"
    fi
fi

echo ""
echo -e "${BLUE}=== セットアップ完了 ===${NC}"
echo ""
echo "次のステップ:"
echo "1. プロジェクト憲法を設定:"
echo "   - .specify/memory/constitution.md を編集"
echo ""
echo "2. 機能仕様を作成:"
echo "   - Claude Code で /speckit.specify コマンドを実行"
echo ""
echo "詳細は README.md を参照してください。"
echo ""
