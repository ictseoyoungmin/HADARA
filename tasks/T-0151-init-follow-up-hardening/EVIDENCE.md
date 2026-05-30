# Evidence

| Time | Kind | Summary | Result |
|---|---|---|---|
| 2026-05-30T05:09:25.982Z | Focused tests | Docker temp-copy `npx vitest run tests/unit/init.test.ts` after init follow-up hardening. | Passed: 1 file, 18 tests. |
| 2026-05-30T05:09:25.982Z | Full validation | Docker temp-copy `npm run check` after implementation and docs updates. | Passed: TypeScript build, 57 test files, 420 tests. |
| 2026-05-30T05:09:25.982Z | Built CLI smoke | Built CLI smoke verified generated SOP registration wording, no generic governed release-planning wording, upgrade missing-doc summary, doctor profile mismatch, invalid register-doc path, `--require-exists`, no partial integration write, and non-runtime integration guidance. | Passed: `t0151-smoke-ok`. |
| 2026-05-30T05:09:25.982Z | Done-level validation | Docker built CLI `node dist/cli/main.js harness validate --task T-0151 --level done --json --project /workspace`. | Passed: `ok: true`. |
| 2026-05-30T05:09:25.982Z | Diff hygiene | `git diff --check` after implementation, docs, and capsule updates. | Passed: no whitespace errors. |
