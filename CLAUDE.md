# bloomo-task Development Guidelines

Last updated: 2025-12-07

## Technology Stack

| Category | Technology | Version |
|----------|------------|---------|
| Framework | Next.js (App Router) | 16.0.7 |
| Language | TypeScript | 5.9.3 |
| UI | React | 19.2.0 |
| Charts | Recharts | 3.5.1 |
| Styling | Tailwind CSS | 4.1.17 |
| Testing | Vitest | 4.0.15 |
| Testing | React Testing Library | 16.3.0 |
| Linter | ESLint | 9.39.1 |
| Formatter | Prettier | 3.7.4 |
| Package Manager | pnpm | 10.24.x |
| Runtime | Node.js | 24.x |

## Project Structure

```text
bloomo-task/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/             # React components
│   │   ├── *.tsx
│   │   └── *.test.tsx          # Component tests (co-located)
│   ├── types/                  # TypeScript type definitions
│   │   └── portfolio.ts
│   ├── utils/                  # Utility functions
│   │   ├── *.ts
│   │   └── *.test.ts           # Utility tests (co-located)
│   └── data/                   # Mock data
│       └── dummy_response.json
├── public/                     # Static assets
├── specs/                      # Feature specifications
│   └── 001-stock-portfolio-viewer/
├── vitest.config.ts
├── vitest.setup.ts
├── .prettierrc
├── eslint.config.mjs
└── package.json
```

## Commands

```bash
pnpm dev          # Start dev server (Turbopack)
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm lint:fix     # Fix ESLint issues
pnpm format       # Format with Prettier
pnpm format:check # Check formatting
pnpm test         # Run tests (watch mode)
pnpm test:run     # Run tests (single run)
```

## Code Style

- Use single quotes for strings
- Use semicolons
- 2 spaces for indentation
- 100 character line width
- Trailing commas in ES5 style

## Test File Convention

- **Location**: Co-located with source files (same directory)
- **Naming**: `*.test.ts` or `*.test.tsx`
- Example: `src/utils/formatters.ts` → `src/utils/formatters.test.ts`

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

### Commit Granularity Rules (MUST FOLLOW)

**コード変更の内容を確認し、適切な粒度でコミットを行うこと。**

以下の種類の変更は必ず別々のコミットに分けること：

1. **ロジックとテストを分離**: ロジックの追加・修正とテストコードの追加・修正は別コミット
2. **コードとドキュメントを分離**: コードの修正とドキュメント（README、CLAUDE.md等）の修正は別コミット
3. **パッケージとコードを分離**: パッケージの追加（package.json変更）とコードの修正は別コミット
4. **設定とコードを分離**: 設定ファイルの変更とアプリケーションコードの変更は別コミット

```bash
# 良い例: 実装とテストを分けてコミット
git add src/utils/formatters.ts
git commit -m "feat: フォーマッター関数を実装"

git add src/utils/formatters.test.ts
git commit -m "test: フォーマッター関数のテストを追加"

# 悪い例: 実装とテストを一緒にコミット
git add src/utils/formatters.ts src/utils/formatters.test.ts
git commit -m "feat: フォーマッター関数を実装してテストを追加"
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
