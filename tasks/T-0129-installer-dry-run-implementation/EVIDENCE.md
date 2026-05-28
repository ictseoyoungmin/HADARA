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
| 2026-05-28T09:59:06Z | test-log | Follow-up focused installer/readiness regression passed after USB-root, default-suggestion, and package-license hardening: `tests/unit/install-plan.test.ts`, `tests/unit/schema-runtime.test.ts`, `tests/unit/tools-list.test.ts`, and `tests/unit/operational-debt.test.ts`; 43 tests. | passed |
| 2026-05-28T09:59:06Z | command-log | Built CLI USB planner smoke passed: `install plan --platform usb --json` returned `ok: false`, issue `USB_ROOT_REQUIRED`, and exit code 6; `install plan --platform usb --usb-root <example root> --json` returned `ok: true` with redacted public path references. | passed |
| 2026-05-28T09:59:06Z | test-log | Docker `npm run check` passed after follow-up hardening: TypeScript build, 50 test files, 351 tests. | passed |
| 2026-05-28T09:59:06Z | command-log | Built CLI strict release gate passed after follow-up hardening: `ok: true`, 12 passed checks, no issues. | passed |
| 2026-05-28T09:59:06Z | command-log | Done-level harness validation passed for T-0129 after evidence and readiness updates with `ok: true` and no issues. | passed |
| 2026-05-28T10:00:24Z | command-log | Final done-level harness sanity check passed for T-0129 after handoff/evidence cleanup with `ok: true` and no issues. | passed |
| 2026-05-28T10:08:53Z | test-log | Docker temp-copy focused installer/readiness regression passed after correcting WSL default install planning: `tests/unit/install-plan.test.ts`, `tests/unit/operational-debt.test.ts`, `tests/unit/schema-runtime.test.ts`, and `tests/unit/tools-list.test.ts`; 44 tests. | passed |
| 2026-05-28T10:08:53Z | test-log | Docker temp-copy `npm run check` passed after WSL default correction: TypeScript build, 50 test files, 352 tests. | passed |
| 2026-05-28T10:08:53Z | command-log | Built CLI WSL installer dry-run smoke passed: `install plan --platform wsl --json` returned `ok: true`, platform `wsl`, Linux-style default prefix `~/.local/share/hadara`, Linux-style launcher `~/.local/bin/hadara`, and no issues. | passed |
| 2026-05-28T10:08:53Z | command-log | Built CLI strict release gate and done-level harness validation passed after WSL default correction: release gate `ok: true`, 12 checks; T-0129 harness `ok: true`, no issues. | passed |
| 2026-05-28T10:11:04Z | command-log | Final workspace done-level harness sanity check passed after documentation/evidence updates with `ok: true` and no issues. | passed |
