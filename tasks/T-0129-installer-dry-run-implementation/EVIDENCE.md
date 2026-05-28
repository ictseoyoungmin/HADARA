# Evidence

| Time | Kind | Summary | Result |
|---|---|---|---|
| 2026-05-28T09:20:13Z | test-log | Docker focused installer dry-run regressions passed: `tests/unit/install-plan.test.ts`, `tests/unit/schema-runtime.test.ts`, and `tests/unit/tools-list.test.ts`; 17 tests. | passed |
| 2026-05-28T09:20:34Z | command-log | Built CLI dry-run smoke passed: `install plan --platform posix --source dist-release/hadara-0.1.0-rc.0.tgz --json` returned schema `hadara.install.plan.v1`, `ok: true`, redacted path references, and no issues. | passed |
| 2026-05-28T09:20:39Z | command-log | Built CLI execute-disabled smoke passed: `install plan --mode execute --json` returned `ok: false`, issue `INSTALL_EXECUTION_DISABLED`, and exit code 6 without install mutation. | passed |
| 2026-05-28T09:21:03Z | test-log | Docker `npm run check` passed: TypeScript build, 50 test files, 346 tests. | passed |
| 2026-05-28T09:24:58Z | command-log | Built CLI strict release gate passed after readiness docs update: `ok: true`, 12 passed checks, no issues. | passed |
| 2026-05-28T09:25:05Z | command-log | Done-level harness validation passed for T-0129 with `ok: true` and no issues. | passed |
| 2026-05-28T09:33:34Z | test-log | Follow-up focused installer dry-run regression passed after adding explicit `--platform linux` support and keeping `posix` as a compatibility alias: 3 files, 18 tests. | passed |
| 2026-05-28T09:33:50Z | command-log | Built CLI Linux installer dry-run smoke passed: `install plan --platform linux --json` returned `ok: true`, platform `linux`, and schema `hadara.install.plan.v1`. | passed |
