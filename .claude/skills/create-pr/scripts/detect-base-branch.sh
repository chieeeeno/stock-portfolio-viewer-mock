#!/bin/bash
#
# detect-base-branch.sh
# 現在のブランチの分岐元ブランチを検出するスクリプト
#
# 使用方法:
#   ./scripts/detect-base-branch.sh [--set <branch>] [--json]
#
# オプション:
#   --set <branch>  分岐元ブランチを明示的に設定
#   --json          結果をJSON形式で出力
#
# 検出優先順位:
#   1. git config branch.<name>.baseBranch（明示的に記録されている場合）
#   2. reflog の "Created from <branch>" を確認
#   3. GitHub CLI でPR履歴を確認
#   4. 全ブランチとの距離を計算し、最も近いブランチを候補として提示
#

set -e

# 色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# オプション解析
JSON_OUTPUT=false
SET_BRANCH=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --set)
            SET_BRANCH="$2"
            shift 2
            ;;
        --json)
            JSON_OUTPUT=true
            shift
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# 現在のブランチを取得
CURRENT_BRANCH=$(git branch --show-current)

if [ -z "$CURRENT_BRANCH" ]; then
    echo "Error: Not on a branch (detached HEAD state)"
    exit 1
fi

# --set オプションが指定された場合、分岐元を記録して終了
if [ -n "$SET_BRANCH" ]; then
    git config --local "branch.${CURRENT_BRANCH}.baseBranch" "$SET_BRANCH"
    echo "Set base branch for '$CURRENT_BRANCH' to '$SET_BRANCH'"
    exit 0
fi

# 結果を格納する変数
DETECTED_BRANCH=""
DETECTION_METHOD=""
CONFIDENCE="low"
CANDIDATES=()

# ================================================================
# 方法1: git config から明示的に設定された分岐元を確認
# ================================================================
check_git_config() {
    local config_base
    config_base=$(git config --local "branch.${CURRENT_BRANCH}.baseBranch" 2>/dev/null || true)

    if [ -n "$config_base" ]; then
        DETECTED_BRANCH="$config_base"
        DETECTION_METHOD="git-config"
        CONFIDENCE="high"
        return 0
    fi
    return 1
}

# ================================================================
# 方法2: reflog から分岐元を確認
# ================================================================
check_reflog() {
    local reflog_entry created_from created_commit

    # "branch: Created from" を含むエントリを探す
    reflog_entry=$(git reflog show "$CURRENT_BRANCH" 2>/dev/null | grep "branch: Created from" | head -1 || true)

    if [ -n "$reflog_entry" ]; then
        created_from=$(echo "$reflog_entry" | sed 's/.*Created from //')
        created_commit=$(echo "$reflog_entry" | awk '{print $1}')

        # ブランチ名が明示的に記録されている場合（HEADではない）
        if [ -n "$created_from" ] && [ "$created_from" != "HEAD" ]; then
            # origin/ プレフィックスを除去
            DETECTED_BRANCH=$(echo "$created_from" | sed 's|^origin/||')
            DETECTION_METHOD="reflog-branch"
            CONFIDENCE="high"
            return 0
        fi

        # "Created from HEAD" の場合、そのコミットを含むブランチを探す
        if [ "$created_from" = "HEAD" ] && [ -n "$created_commit" ]; then
            local containing_branches
            containing_branches=$(git branch -r --contains "$created_commit" 2>/dev/null | grep -v HEAD | grep -v "$CURRENT_BRANCH" | head -5 || true)

            if [ -n "$containing_branches" ]; then
                # 最初の候補を使用
                DETECTED_BRANCH=$(echo "$containing_branches" | head -1 | sed 's|^[[:space:]]*origin/||')
                DETECTION_METHOD="reflog-commit"
                CONFIDENCE="medium"

                # 他の候補も記録
                while IFS= read -r branch; do
                    branch=$(echo "$branch" | sed 's|^[[:space:]]*origin/||')
                    if [ -n "$branch" ]; then
                        CANDIDATES+=("$branch")
                    fi
                done <<< "$containing_branches"

                return 0
            fi
        fi
    fi
    return 1
}

# ================================================================
# 方法3: GitHub CLI でPR履歴を確認
# ================================================================
check_github_pr() {
    # gh コマンドが利用可能かチェック
    if ! command -v gh &> /dev/null; then
        return 1
    fi

    # 認証されているかチェック
    if ! gh auth status &> /dev/null 2>&1; then
        return 1
    fi

    local pr_base
    pr_base=$(gh pr list --head "$CURRENT_BRANCH" --state all --json baseRefName --jq '.[0].baseRefName' 2>/dev/null || true)

    if [ -n "$pr_base" ] && [ "$pr_base" != "null" ]; then
        DETECTED_BRANCH="$pr_base"
        DETECTION_METHOD="github-pr"
        CONFIDENCE="high"
        return 0
    fi
    return 1
}

# ================================================================
# 方法4: 全ブランチとの距離を計算
# ================================================================
calculate_branch_distances() {
    local current_head
    current_head=$(git rev-parse HEAD)

    # リモートブランチを最新化
    git fetch --all --prune 2>/dev/null || true

    local best_branch=""
    local best_score=999999
    local results=()

    while IFS= read -r branch; do
        # 空行とHEAD、現在のブランチをスキップ
        branch=$(echo "$branch" | tr -d '[:space:]')
        if [ -z "$branch" ] || [[ "$branch" == *"HEAD"* ]] || [[ "$branch" == *"$CURRENT_BRANCH"* ]]; then
            continue
        fi

        local merge_base ahead behind score timestamp
        merge_base=$(git merge-base "$current_head" "$branch" 2>/dev/null || true)

        if [ -n "$merge_base" ]; then
            ahead=$(git rev-list --count "$merge_base".."$current_head" 2>/dev/null || echo "0")
            behind=$(git rev-list --count "$merge_base".."$branch" 2>/dev/null || echo "0")
            timestamp=$(git log -1 --format=%ct "$merge_base" 2>/dev/null || echo "0")
            score=$((ahead + behind))

            # ブランチ名からorigin/を除去
            local clean_branch
            clean_branch=$(echo "$branch" | sed 's|^origin/||')

            results+=("$score|$ahead|$behind|$timestamp|$clean_branch")

            if [ "$score" -lt "$best_score" ]; then
                best_score=$score
                best_branch="$clean_branch"
            fi
        fi
    done < <(git branch -r)

    if [ -n "$best_branch" ]; then
        DETECTED_BRANCH="$best_branch"
        DETECTION_METHOD="distance-calculation"
        CONFIDENCE="medium"

        # 上位5件を候補として記録
        IFS=$'\n' sorted=($(printf '%s\n' "${results[@]}" | sort -t'|' -k1 -n | head -5))
        for result in "${sorted[@]}"; do
            local branch_name
            branch_name=$(echo "$result" | cut -d'|' -f5)
            if [ -n "$branch_name" ]; then
                CANDIDATES+=("$branch_name")
            fi
        done

        return 0
    fi
    return 1
}

# ================================================================
# メイン処理
# ================================================================

# 各方法を順番に試行
if check_git_config; then
    : # 成功
elif check_reflog; then
    : # 成功
elif check_github_pr; then
    : # 成功
elif calculate_branch_distances; then
    : # 成功
else
    DETECTED_BRANCH=""
    DETECTION_METHOD="none"
    CONFIDENCE="none"
fi

# ================================================================
# 結果出力
# ================================================================

if [ "$JSON_OUTPUT" = true ]; then
    # JSON形式で出力
    candidates_json=$(printf '%s\n' "${CANDIDATES[@]}" | jq -R . | jq -s .)
    cat <<EOF
{
  "currentBranch": "$CURRENT_BRANCH",
  "detectedBranch": "$DETECTED_BRANCH",
  "method": "$DETECTION_METHOD",
  "confidence": "$CONFIDENCE",
  "candidates": $candidates_json
}
EOF
else
    # 人間が読みやすい形式で出力
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}  Base Branch Detection Result${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
    echo -e "Current branch: ${GREEN}$CURRENT_BRANCH${NC}"
    echo ""

    if [ -n "$DETECTED_BRANCH" ]; then
        case $CONFIDENCE in
            high)
                echo -e "Detected base: ${GREEN}$DETECTED_BRANCH${NC}"
                echo -e "Confidence:    ${GREEN}HIGH${NC}"
                ;;
            medium)
                echo -e "Detected base: ${YELLOW}$DETECTED_BRANCH${NC}"
                echo -e "Confidence:    ${YELLOW}MEDIUM${NC}"
                ;;
            *)
                echo -e "Detected base: ${RED}$DETECTED_BRANCH${NC}"
                echo -e "Confidence:    ${RED}LOW${NC}"
                ;;
        esac
        echo -e "Method:        $DETECTION_METHOD"

        if [ ${#CANDIDATES[@]} -gt 1 ]; then
            echo ""
            echo "Other candidates:"
            for candidate in "${CANDIDATES[@]:1}"; do
                echo "  - $candidate"
            done
        fi
    else
        echo -e "${RED}Could not detect base branch${NC}"
        echo ""
        echo "You can set it manually:"
        echo "  ./scripts/detect-base-branch.sh --set <branch-name>"
    fi

    echo ""
    echo -e "${BLUE}========================================${NC}"

    # 分岐元を設定するヒント
    if [ "$CONFIDENCE" != "high" ] && [ -n "$DETECTED_BRANCH" ]; then
        echo ""
        echo "To confirm this as the base branch, run:"
        echo -e "  ${GREEN}./scripts/detect-base-branch.sh --set $DETECTED_BRANCH${NC}"
        echo ""
    fi
fi
