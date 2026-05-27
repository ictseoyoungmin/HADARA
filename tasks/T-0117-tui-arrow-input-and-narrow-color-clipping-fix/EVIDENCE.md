# Evidence

| Time | Kind | Summary | Result |
|---|---|---|---|
| 2026-05-27T13:49:23+09:00 | focused-test | Docker temp-copy focused TUI input/layout suite passed: `npx vitest run tests/unit/tui-layout.test.ts tests/unit/tui-terminal.test.ts tests/unit/tui-snapshot.test.ts tests/unit/tui-state.test.ts` with 4 files and 33 tests. | passed |
| 2026-05-27T13:49:23+09:00 | full-check | Docker temp-copy `npm run check` passed with TypeScript build, 48 test files, and 323 tests. | passed |
| 2026-05-27T13:49:23+09:00 | validation | Docker built CLI `harness validate --task T-0117 --level done --json --project /workspace` returned `ok: true` with no issues after removing a duplicate Task Board row. | passed |
| 2026-05-27T14:00:10+09:00 | focused-test | Docker temp-copy focused TUI suite passed after adding renderer-derived Detail scroll clamping: `npx vitest run tests/unit/tui-state.test.ts tests/unit/tui-terminal.test.ts tests/unit/tui-snapshot.test.ts tests/unit/tui-layout.test.ts` with 4 files and 35 tests. | passed |
| 2026-05-27T14:00:10+09:00 | full-check | Docker temp-copy `npm run check` passed with TypeScript build, 48 test files, and 325 tests after the hidden overscroll fix. | passed |
| 2026-05-27T14:02:02+09:00 | validation | Docker built CLI `harness validate --task T-0117 --level done --json --project /workspace` returned `ok: true` with no issues after the hidden overscroll documentation update. | passed |
