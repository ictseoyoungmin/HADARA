# Evidence

| Time | Kind | Summary | Result |
|---|---|---|---|
| 2026-05-27T12:01:40+09:00 | test | Docker focused TUI check: `npx vitest run tests/unit/tui-snapshot.test.ts tests/unit/tui-terminal.test.ts tests/unit/tui-state.test.ts` passed with 3 files and 28 tests. | passed |
| 2026-05-27T12:01:40+09:00 | test | Docker full check: `npm run check` passed with TypeScript build, 47 test files, and 317 tests. | passed |
| 2026-05-27T12:01:40+09:00 | smoke | Built CLI snapshot smoke: `node dist/cli/main.js tui --snapshot --compact --width 86 --height 24 --project /workspace` exited 0 and rendered the HADARA Work Console for T-0115. | passed |
| 2026-05-27T12:01:40+09:00 | validation | Docker done-level harness validation: `node dist/cli/main.js harness validate --task T-0115 --level done --json --project /workspace` returned `ok: true` with no issues. | passed |
| 2026-05-27T12:10:24+09:00 | regression | Docker focused TUI check after Help tab release fix: `npx vitest run tests/unit/tui-terminal.test.ts tests/unit/tui-snapshot.test.ts tests/unit/tui-state.test.ts` passed with 3 files and 29 tests. | passed |
| 2026-05-27T12:10:24+09:00 | test | Docker full check after Help tab release fix: `npm run check` passed with TypeScript build, 47 test files, and 318 tests. | passed |
| 2026-05-27T12:10:24+09:00 | validation | Docker done-level harness validation after Help tab release fix: `node dist/cli/main.js harness validate --task T-0115 --level done --json --project /workspace` returned `ok: true` with no issues. | passed |
| 2026-05-27T12:18:59+09:00 | regression | Docker focused TUI check after Task cursor policy fix: `npx vitest run tests/unit/tui-state.test.ts tests/unit/tui-snapshot.test.ts tests/unit/tui-terminal.test.ts` passed with 3 files and 30 tests. | passed |
| 2026-05-27T12:18:59+09:00 | test | Docker full check after Task cursor policy fix: `npm run check` passed with TypeScript build, 47 test files, and 319 tests. | passed |
| 2026-05-27T12:18:59+09:00 | validation | Docker done-level harness validation after Task cursor policy fix: `node dist/cli/main.js harness validate --task T-0115 --level done --json --project /workspace` returned `ok: true` with no issues. | passed |
| 2026-05-27T12:24:14+09:00 | smoke | Rebuilt `hadara-cli-test` `/opt/hadara` from `/workspace`; installed `hadara tui --snapshot --compact --width 86 --height 24 --project /workspace` rendered the HADARA Work Console for manual TUI testing. | passed |
| 2026-05-27T12:42:24+09:00 | regression | Docker focused TUI check after Overview card width/color fix: `npx vitest run tests/unit/tui-snapshot.test.ts tests/unit/tui-state.test.ts tests/unit/tui-terminal.test.ts` passed with 3 files and 31 tests. | passed |
| 2026-05-27T12:42:24+09:00 | test | Docker full check after Overview card width/color fix: `npm run check` passed with TypeScript build, 47 test files, and 320 tests. | passed |
| 2026-05-27T12:42:24+09:00 | smoke | Rebuilt `hadara-cli-test` `/opt/hadara`; `hadara tui --snapshot --width 150 --height 27 --color --project /workspace` rendered side-by-side work cards with intact Previous Work border and label colors. | passed |
| 2026-05-27T12:42:24+09:00 | validation | Docker done-level harness validation after Overview card width/color fix: `node dist/cli/main.js harness validate --task T-0115 --level done --json --project /workspace` returned `ok: true` with no issues. | passed |
