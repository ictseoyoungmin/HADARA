# Evidence

| Time | Kind | Summary | Result |
|---|---|---|---|
| 2026-05-28T10:38:14Z | test-log | Docker temp-copy `npm run check` passed with TypeScript build, 51 test files, and 357 tests. | passed |
| 2026-05-28T10:38:56Z | command-log | Built CLI `smoke run --profile core --json` returned `ok: true`, schema `hadara.featureSmoke.v1`, 6 passed steps, and no issues. | passed |
| 2026-05-28T10:38:56Z | command-log | Built CLI `smoke run --profile release-readiness --json` returned `ok: false`, issue `FEATURE_SMOKE_PROFILE_DEFERRED`, and exit code 6. | passed |
| 2026-05-28T10:39:30Z | command-log | Done-level harness validation passed for T-0131 with `ok: true` and no issues. | passed |
| 2026-05-28T10:57:21Z | test-log | Follow-up focused feature-smoke/schema/tools-list tests passed after clarifying service/read-model execution and registered sub-schema validation: 4 files, 18 tests. | passed |
| 2026-05-28T10:57:21Z | test-log | Follow-up Docker temp-copy `npm run check` passed with TypeScript build, 51 test files, and 357 tests. | passed |
| 2026-05-28T10:57:21Z | command-log | Follow-up built CLI core smoke returned `executionMode: service-read-model`, `binaryExecuted: false`, `launcherChecked: false`, `packageInstallChecked: false`, schema-status markers, and `ok: true`. | passed |
| 2026-05-28T10:57:55Z | command-log | Follow-up done-level harness validation passed for T-0131 with `ok: true`; strict release gate also remained `ok: true` with 13 checks. | passed |
