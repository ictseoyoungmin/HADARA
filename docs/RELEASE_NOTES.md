# RELEASE_NOTES

## 0.2.0-rc.3

Source publish candidate prepared after the `0.2.0-rc.2` dogfooding findings around proof reliability, evidence append races, and CI gate visibility.

Highlights:

- Hardens evidence append writes with task-scoped locking and explicit idempotency keys so parallel evidence writes do not create duplicate failed records for the same logical command.
- Adds `hadara proof status` and `hadara proof explain` for evidence sufficiency, close-audit freshness, and operator-readable proof diagnostics.
- Adds `hadara ci gate --mode advisory|strict` as an aggregating local gate over protocol, evidence, proof, and deferred release checks.
- Refreshes package metadata, README release status, and release-readiness docs for the rc3 source candidate.

Boundaries:

- This entry describes the source publish candidate. npm publish, GitHub Release creation, Docker image publishing, installer execution, and registry mutation remain out of scope until a separate operator-approved publish capsule runs.
- The latest npm-published release candidate before rc3 publication remains `hadara@0.2.0-rc.2`.

## 0.2.0-rc.2

Release candidate published to npm after the init scaffold lifecycle/protocol guidance hardening from T-0279 through T-0281 and the T-0282 publish-readiness refresh.

Highlights:

- Updates generated `hadara init` docs so new projects get current task workflow guidance, evidence integrity rules, project-specific document registration guidance, and direct `harness validate --level done` diagnostics.
- Adds common multi-language local artifact hygiene to generated `.gitignore`, including Python virtualenv/cache/SQLite patterns needed by FastAPI/pytest-style dogfooding projects.
- Clarifies close-source stability before `task close` so agents avoid repeated close/audit churn from post-close documentation edits.
- Refreshes npm package metadata, README install examples, release readiness docs, and manual publish helper examples for `hadara@0.2.0-rc.2`.
- Publishes `hadara@0.2.0-rc.2` to npm through the approval-gated manual helper and verifies `npm view` returned `0.2.0-rc.2`.

Boundaries:

- npm publish was completed as an operator-confirmed release mutation after the helper regenerated release artifact, package smoke, and clean-checkout smoke evidence.
- The Python bridge remains the separately published preview package `hadara==0.2.0rc1` and is not changed by this npm RC.
- GitHub Release creation remains optional and was not requested during the npm publish helper run; Docker image publishing, installer execution, PyPI publishing, and MCP release/package execution remain deferred unless a future capsule explicitly enables them.

## 0.2.0-rc.1

Release candidate published to npm after the npm-installed recycle fixes from T-0272 through T-0274 and publish-readiness refresh in T-0275.

Highlights:

- Fixes generated deterministic `run scaffold` scripts so fake-shell JSON observations match successfully.
- Hardens fresh initialized project UX for `init --json`, init doctor, status/TUI phase parsing, handoff update JSON, generic handoff suggestions, and context artifact paths.
- Improves lifecycle status clarity and mounted-workspace performance for single-task finish/read/evidence commands.
- Adds redacted failed-step diagnostics to `dev docker-check` reports while continuing to omit raw subprocess logs.
- Refreshes package metadata, README install examples, package smoke, clean-checkout smoke, release artifact, release dry-run, and publish dry-run evidence for the rc.1 source state.
- Publishes `hadara@0.2.0-rc.1` to npm through the approval-gated manual helper and verifies `npm view hadara@0.2.0-rc.1 version` returns `0.2.0-rc.1`.

Boundaries:

- npm publish was completed as an operator-confirmed release mutation after the readiness capsule was closed.
- GitHub Release creation remains optional and was not requested during the npm publish helper run.
- Docker image publishing, PyPI publishing, installer execution, and MCP release/package execution remain deferred.

## 0.2.0-rc.0

Release-candidate freeze target for Phase 6 and Phase 6.1 work. T-0269 prepared the approval-gated npm publish path, but this candidate was superseded by `0.2.0-rc.1` in T-0275 before any publish mutation.

Highlights:

- Adds workflow compression primitives for task completion, finish/ready/close, handoff suggestions, and operator-facing command reports.
- Adds multi-agent-compatible metadata foundations, including actor context fields, mutation vocabulary separation, sync-dist before-hash guarding, close evidence race recheck, and task create collision guarding.
- Refreshes package, clean-checkout, release-artifact, release dry-run, and publish dry-run evidence for the current source checkout.
- Updates README install and npx examples for the `0.2.0-rc.0` publish candidate.

Boundaries:

- This RC target does not claim full multi-agent runtime safety, lock-safe shared execution across all commands, or a complete multi-agent controller.
- Publish execution, registry mutation, GitHub Release creation, Docker image build/push, PyPI publish/token loading, and release mutation remain out of scope.
- Actual npm publish for this rc.0 candidate should not proceed; use the superseding `0.2.0-rc.1` T-0275 helper path instead.

## 0.1.0-rc.0

First npm release candidate for early CLI evaluation.
