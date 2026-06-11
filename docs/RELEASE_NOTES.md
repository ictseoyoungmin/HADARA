# RELEASE_NOTES

## 0.3.0-rc.1

Release candidate prepared after the 0.3.0-rc.0 publish exposed two adoption problems: existing projects need a safe path onto the new 0.3 protocol surface, and npm package discovery metadata must be present in the published tarball before the next registry mutation.

Highlights:

- Adds `hadara protocol migrate` as a dry-run-first upgrade path for existing HADARA projects that were initialized before the 0.3 surface refactor.
- Reports protocol version state and planned changes before mutation so operators can see whether a project is already current or still on an older scaffold.
- Supports selected project/task scoped migration for docs registry insertion, managed section markers, command surface documentation refresh, and Required Reading cleanup.
- Uses before-hash guarded execute plans so migration writes are rejected when a target file changed after the dry-run plan.
- Preserves task evidence during task-scoped migration: existing `evidence.jsonl` files are never overwritten, and a missing task evidence log is created only when needed.
- Keeps task status history rows inside the managed status table when finishing capsules, preventing malformed Markdown from release and migration workflows.
- Hardens npm publish metadata by validating the staged tarball `package/package.json` for description, keywords, repository, homepage, and bugs fields before publish.
- Tightens the manual rc publish helper so the release capsule must match the package version and a successful dry-run can be followed by `--execute` in the same clean `/tmp` clone.

Boundaries:

- This release candidate prepares the npm package for operator-confirmed publish; it does not itself publish to npm, create a GitHub Release, build Docker images, publish PyPI artifacts, or run installer mutation.
- Protocol migration is scoped and hash-guarded; it is not a broad historical rewrite engine and does not delete archived or superseded documents.
- GitHub Release creation remains optional through the manual helper after npm publish.

## 0.3.0-rc.0

Source candidate prepared during Phase 7.6 after the Phase 7 surface-refactor slices completed. This entry describes implemented behavior only; npm publish remains approval-gated and is not performed by the source-candidate documentation update.

Highlights:

- Adds structured command help and a machine-readable command registry so agents can distinguish primary lifecycle commands from diagnostics, advanced, release-only, UI, integration, and compatibility surfaces.
- Adds canonical capsule lifecycle guidance and command portfolio audit documentation for non-overlap rules and confusable command boundaries.
- Adds a document registry and docs doctor for canonical/active/reference/historical/superseded document classification, required-reading drift, canonical conflicts, and cleanup diagnostics.
- Adds managed Markdown section discovery and hash-guarded managed patch plans for command-owned sections while keeping user-authored prose outside automated writes.
- Adds docs cleanup status marking, required-reading pruning, and dry-run archive planning without deleting or moving historical files by default.
- Runs Phase 7.6 installed-package recycle and fresh-init validation before any external 0.3.0 publish can be considered.

Boundaries:

- 0.3.0 is not a full agent runtime, Rack/enterprise release, Dashboard/TUI redesign, broad document rewrite engine, automatic historical deletion release, or release automation expansion.
- `docs archive` remains dry-run planning only; cleanup status changes are registry metadata unless a separate managed patch is applied.
- Publish mutation, GitHub Release creation, Docker image publishing, and PyPI publication remain explicit operator-approved actions.

## 0.2.0-rc.3

Release candidate published to npm after the `0.2.0-rc.2` dogfooding findings around proof reliability, evidence append races, and CI gate visibility, followed by the T-0289 post-hardening readiness refresh.

Highlights:

- Hardens evidence append writes with task-scoped locking and explicit idempotency keys so parallel evidence writes do not create duplicate failed records for the same logical command.
- Adds `hadara proof status` and `hadara proof explain` for evidence sufficiency, close-audit freshness, and operator-readable proof diagnostics.
- Adds `hadara ci gate --mode advisory|strict` as an aggregating local gate over protocol, evidence, proof, and deferred release checks.
- Refreshes package metadata, README release status, and release-readiness docs for the rc3 source candidate.
- Publishes `hadara@0.2.0-rc.3` to npm through the approval-gated manual helper and verifies `npm view` returned `0.2.0-rc.3`.

Boundaries:

- npm publish was completed as an operator-confirmed release mutation after T-0289 re-proved package smoke, clean-checkout, release gate, release dry-run, publish dry-run, and full Docker-suite readiness.
- GitHub Release creation remains optional and was not requested during the npm publish helper run; Docker image publishing, installer execution, PyPI publishing, and MCP release/package execution remain deferred unless a future capsule explicitly enables them.

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
