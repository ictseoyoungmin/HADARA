# Evidence

| Time | Kind | Summary | Result |
|---|---|---|---|
| 2026-05-30T04:31:58.044Z | Focused tests | Docker temp-copy `npx vitest run tests/unit/init.test.ts` covered init doctor, lazy store behavior, profile upgrade, Required Reading registration, optional integration enablement, and existing init profile behavior. | Passed: 1 file, 14 tests. |
| 2026-05-30T04:31:58.044Z | Full validation | Docker temp-copy `npm run check` after final implementation and docs updates. | Passed: TypeScript build, 57 test files, 416 tests. |
| 2026-05-30T04:31:58.044Z | Built CLI smoke | Built CLI smoke initialized a temp project, ran `init doctor --json`, dry-ran/executed governed profile upgrade, executed Required Reading registration, dry-ran/executed Hermes integration enablement, and confirmed `.hadara/local/portable` was not eagerly created. | Passed: `init-followup-smoke-ok`. |
| 2026-05-30T04:31:58.044Z | Done-level validation | Docker built CLI `node dist/cli/main.js harness validate --task T-0150 --level done --json --project /workspace`. | Passed: `ok: true`. |
| 2026-05-30T04:31:58.044Z | Diff hygiene | `git diff --check` after implementation, docs, and capsule updates. | Passed: no whitespace errors. |
