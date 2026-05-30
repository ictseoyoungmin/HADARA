# Evidence

| Time | Kind | Summary | Result |
|---|---|---|---|
| 2026-05-30T05:28:52.014Z | Focused tests | Docker temp-copy `npx vitest run tests/unit/init.test.ts` after profile metadata merge and atomic integration write hardening. | Passed: 1 file, 19 tests. |
| 2026-05-30T05:28:52.014Z | Full validation | Docker temp-copy `npm run check` after implementation and docs updates. | Passed: TypeScript build, 57 test files, 421 tests. |
| 2026-05-30T05:28:52.014Z | Built CLI smoke | Built CLI smoke verified upgrade profile metadata merge, clean doctor after upgrade, non-runtime integration guidance, and no integration doc creation when SOP registration fails. | Passed: `t0151-upgrade-atomic-smoke-ok`. |
| 2026-05-30T05:28:52.014Z | Done-level validation | Docker built CLI `node dist/cli/main.js harness validate --task T-0151 --level done --json --project /workspace`. | Passed: `ok: true`. |
| 2026-05-30T05:28:52.014Z | Diff hygiene | `git diff --check` after implementation, docs, and capsule updates. | Passed: no whitespace errors. |
