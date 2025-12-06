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
