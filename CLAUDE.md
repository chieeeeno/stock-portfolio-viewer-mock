# bloomo-task Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-12-07

## Active Technologies
- TypeScript 5.x / React 19.x + Recharts, Tailwind CSS (001-stock-portfolio-viewer)
- N/A（モックJSONファイルを使用） (001-stock-portfolio-viewer)

- (001-stock-portfolio-viewer)

## Project Structure

```text
backend/
frontend/
tests/
```

## Commands

# Add commands for 

## Code Style

: Follow standard conventions

## Recent Changes
- 001-stock-portfolio-viewer: Added TypeScript 5.x / React 19.x + Recharts, Tailwind CSS

- 001-stock-portfolio-viewer: Added

<!-- MANUAL ADDITIONS START -->

## Critical Rules

### Git Commit Rules (MUST FOLLOW)

**絶対に `git add -A` や `git add .` を使用しないこと。**

コミット時は必ず以下のルールを遵守すること：

1. **明示的なファイル指定**: コミット対象のファイルのみを個別に `git add <file1> <file2> ...` で指定する
2. **変更内容の確認**: `git status` で変更ファイルを確認し、コミットすべきファイルのみを選択する
3. **無関係なファイルの除外**: タスクに関係のないファイル（CURRENT_WORK.md等）はコミットに含めない

```bash
# 禁止
git add -A
git add .
git commit -a

# 正しい方法
git add src/components/Example.tsx src/utils/helper.ts
git commit -m "メッセージ"
```

---

### Context Window Management (IMPORTANT)

When the context window remaining drops below 10%:

1. **IMMEDIATELY** update `CURRENT_WORK.md` with:
   - Current task status (what was being worked on)
   - Completed items in this session
   - Next steps / remaining tasks
   - Any blockers or important notes
   - Commands to resume work

2. **Notify the user** that context is running low and handoff is prepared

3. **Format for CURRENT_WORK.md update**:
   ```markdown
   ## Session Handoff (YYYY-MM-DD HH:MM)

   ### Current Task
   [What was being worked on]

   ### Completed This Session
   - [Item 1]
   - [Item 2]

   ### Next Steps
   1. [Next action]
   2. [Following action]

   ### Resume Command
   `/speckit.tasks` or specific command to continue
   ```

This ensures seamless work continuation across sessions.

<!-- MANUAL ADDITIONS END -->
