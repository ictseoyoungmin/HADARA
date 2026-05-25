# Context

Relevant documents, files, assumptions, and constraints.

- User feedback flagged three blocking/P1 policy concerns: release-risk commands in auto/trusted, network-risk commands in auto/trusted, and strict release-gate process exit code.
- Current `src/policy/permission-matrix.ts` already denies release risk outside release mode and asks in release mode.
- Current `src/policy/permission-matrix.ts` already asks with high risk for network commands in auto/trusted modes.
- Current `src/cli/release-gate.ts` already sets `process.exitCode = 6` when `createReleaseGateReport()` returns `ok: false`.
- Existing `tests/unit/policy.test.ts` already covers `npm publish` and `curl` policy regressions; T-0093 sharpens the release-gate exit-code regression and records fresh evidence.
