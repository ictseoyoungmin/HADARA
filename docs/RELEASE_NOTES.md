# RELEASE_NOTES

## 0.3.3

Stable release for context routing, speed-first context cache paths, bounded session-start context, and the finalize-first agent lifecycle after `0.3.3-rc.0` publish verification and PatternForge dogfood hardening.

Highlights:

- Promotes the `0.3.3-rc.0` context-routing and lifecycle behavior to the stable line.
- Adds 0.3.3 context routing surfaces: `hadara context graph`, `hadara context pack`, `hadara context slice`, `hadara context cache status`, `hadara context cache warm`, and `hadara session start`.
- Builds project context graph/state projection over tasks, docs registry, command registry, evidence, managed sections, decisions, handoff known problems, and release readiness sources.
- Adds code link/index extraction for imports, exports, symbols, command/test file hints, and optional code-aware graph reads.
- Adds deterministic context pack and raw context slice support with path denylist/allowlist hardening, byte-budget enforcement, bounded ranges/windows, and source-addressed output.
- Adds explicit context cache warm paths for source manifests, graph-core shards, code-index shards, incremental per-file code-index reuse, and read-only warm cache consumption.
- Adds bounded `session start` guidance with degraded fast default behavior and explicit `--live` opt-in for broader graph/context-pack work.
- Adds lifecycle convenience surfaces: `task lifecycle`, `task close-repair-plan`, read-only `task finalize`, and guarded `task finalize --execute --plan-hash`.
- Makes the 0.3.3 finalize-first path the default agent-facing lifecycle while preserving low-level `task finish`, `task ready`, `task close`, and `task audit-close` as proof-boundary commands for debugging and recovery.
- Incorporates PatternForge dogfood findings hardening before stable: cached Task Board node classification no longer depends only on graph-node `kind`, and warning-only handoff drift no longer becomes a required next action once a task is closed-valid.

Boundaries:

- T-0406 published stable `hadara@0.3.3` to npm with `latest`; T-0407 verified the published package from installed consumer paths.
- GitHub Release creation, Docker image publish, PyPI publish, installer execution, and MCP release/package execution remain out of scope unless a future capsule explicitly approves them.
- Context cache writes remain explicit warm actions under `.hadara/local/cache/context`; ordinary read commands do not update cache.
- Mounted-filesystem broad graph/cache/pack latency remains an explicit-command residual; default Session Start stays bounded/cache-preferential.
- Real provider integration, dashboard productization, full agent-controller work, evidence rebuild preview/execute, and non-npm release targets remain deferred candidate scope.

## 0.3.3-rc.0

Release candidate preparation line for context routing, speed-first context cache paths, bounded session-start context, and the finalize-first agent lifecycle after stable `0.3.2`.

Highlights:

- Adds 0.3.3 context routing surfaces: `hadara context graph`, `hadara context pack`, `hadara context slice`, `hadara context cache status`, `hadara context cache warm`, and `hadara session start`.
- Builds project context graph/state projection over tasks, docs registry, command registry, evidence, managed sections, decisions, handoff known problems, and release readiness sources.
- Adds code link/index extraction for imports, exports, symbols, command/test file hints, and optional code-aware graph reads.
- Adds deterministic context pack and raw context slice support with path denylist/allowlist hardening, byte-budget enforcement, bounded ranges/windows, and source-addressed output.
- Adds explicit context cache warm paths for source manifests, graph-core shards, code-index shards, incremental per-file code-index reuse, and read-only warm cache consumption.
- Adds bounded `session start` guidance with degraded fast default behavior and explicit `--live` opt-in for broader graph/context-pack work.
- Adds context-routing performance fixtures for mounted/ext4 observations, advisory thresholds, and fast E2E smoke profiles.
- Adds lifecycle convenience surfaces: `task lifecycle`, `task close-repair-plan`, read-only `task finalize`, and guarded `task finalize --execute --plan-hash`.
- Makes the 0.3.3 finalize-first path the default agent-facing lifecycle while preserving low-level `task finish`, `task ready`, `task close`, and `task audit-close` as proof-boundary commands for debugging and recovery.

Boundaries:

- T-0401 prepared source/readiness only. T-0402 then published `hadara@0.3.3-rc.0` to npm with the `next` dist-tag, verified registry visibility, verified `latest` remains `0.3.2`, and passed a temporary-prefix installed-bin smoke.
- GitHub Release creation, Docker image publish, PyPI publish, installer execution, and MCP release/package execution remain out of scope unless a future capsule explicitly approves them.
- Context cache writes remain explicit warm actions under `.hadara/local/cache/context`; ordinary read commands do not update cache.
- Mounted-filesystem broad graph/cache/pack latency remains an explicit-command residual; default Session Start stays bounded/cache-preferential.
- Real provider integration, dashboard productization, full agent-controller work, evidence rebuild preview/execute, and non-npm release targets remain deferred candidate scope.

## 0.3.2

Stable release for the Evidence v2 refactor line after `0.3.2-rc.0` publish verification, installed-package recycle, and T-0339 dogfooding found no release-blocking issue.

Highlights:

- Promotes the `0.3.2-rc.0` Evidence v2 behavior to the stable line.
- Adds explicit Evidence v2 command metadata to `evidence add-command`: `--category`, `--outcome`, `--resolves`, `--supersedes`, and optional `--idempotency-key`.
- Rejects incompatible explicit `--result`/`--outcome` combinations at both CLI and core writer append boundaries with `EVIDENCE_RESULT_OUTCOME_MISMATCH`.
- Makes `evidence list` the supported durable evidence id discovery surface: text output includes copyable ids and category/outcome, while JSON records expose id stability and persisted schema metadata.
- Documents exact marker workflow for durable persisted `ev:` ids and cautions that legacy compatibility ids are inspection-only.
- Documents the evidence rebuild boundary: canonical append-only `evidence.jsonl`, non-canonical `EVIDENCE.md`, no 0.3.2 rebuild preview/execute, and future drift-class plus before-hash requirements.

Boundaries:

- T-0340 published stable `hadara@0.3.2` to npm with `latest`; `next` remains on `0.3.2-rc.0`.
- Rebuild preview/execute, `check-id`, `subject`, and a new add-command report schema id remain deferred candidate scope.
- Broad historical migration, shell execution through evidence commands, and non-npm release mutations remain outside this release.

## 0.3.2-rc.0

Release candidate preparation line for Evidence v2 writer stabilization, id discovery, and docs consolidation after `0.3.1-rc.1` post-publish recycle.

Highlights:

- Adds explicit Evidence v2 command metadata to `evidence add-command`: `--category`, `--outcome`, `--resolves`, `--supersedes`, and optional `--idempotency-key`.
- Rejects incompatible explicit `--result`/`--outcome` combinations at both CLI and core writer append boundaries with `EVIDENCE_RESULT_OUTCOME_MISMATCH`.
- Makes `evidence list` the supported durable evidence id discovery surface: text output includes copyable ids and category/outcome, while JSON records expose id stability and persisted schema metadata.
- Documents exact marker workflow for durable persisted `ev:` ids and cautions that legacy compatibility ids are inspection-only.
- Documents the evidence rebuild boundary: canonical append-only `evidence.jsonl`, non-canonical `EVIDENCE.md`, no 0.3.2 rebuild preview/execute, and future drift-class plus before-hash requirements.

Boundaries:

- Rebuild preview/execute, `check-id`, `subject`, and a new add-command report schema id remain deferred candidate scope.
- Broad historical migration, shell execution through evidence commands, and release/publish mutation remain outside this docs consolidation line.

## 0.3.1-rc.1

Release candidate for the Phase 8 State Governance line after stable `0.3.0` publish/recycle and the T-0325 CloseState derived-state cleanup.

Highlights:

- Defines persistent `TaskStatus`, derived `CloseState`, document registry `DocStatus`, and evidence outcome token families in root and generated workflow docs.
- Removes persistent `CloseState` from task-local close-source handoff current-state tables and keeps close proof state derived through status, audit, proof, and state read models.
- Adds done-level validation for stale pending-close wording, persisted handoff `CloseState`, and `PLAN.md` rows left `In Progress`.
- Resolves installed-package recycle findings by documenting temp-prefix installed-bin proof as canonical when PATH, global installs, `npx`, or DNS/cache behavior is ambiguous.
- Adds read-only state consistency projection and `hadara state verify --json`, with advisory protocol doctor/status/CI integration.
- Hardens task discovery so task-like leftover directories without `TASK.md` are ignored rather than projected as real capsules.
- Expands npm publishable metadata checks from the previous `0.x.0[-rc.N]` release pattern to patch-line versions such as `0.3.1-rc.1`.

Boundaries:

- T-0326 prepared `hadara@0.3.1-rc.1` source metadata, release docs, and release readiness evidence without publish mutation.
- T-0327 published `hadara@0.3.1-rc.1` through the approval-gated helper and corrected npm dist-tags so stable `0.3.0` remains `latest` while rc1 is available as `next`.
- T-0328 verified the published package through installed-package recycle, including registry/dist-tags, exact npx, temp-prefix installed bin, command registry, broad CLI command-family, release dry-run, MCP, TUI, run scaffold, lifecycle, and cleanup surfaces.
- GitHub Release creation remains optional; Docker image publishing, PyPI publishing, installer execution, MCP release/package execution, and token loading remain deferred unless a future capsule explicitly enables them.

## 0.3.0

Stable release for the Phase 7 Surface Refactor after `0.3.0-rc.2` post-publish recycle, HADARA-dev docs registry artifact dogfooding, and docs patch atomic write hardening.

Highlights:

- Adds structured command help and a machine-readable command registry so agents can distinguish primary lifecycle commands from diagnostics, advanced, release-only, UI, integration, and compatibility surfaces.
- Adds canonical lifecycle guidance and command portfolio audit rules for confusable command boundaries.
- Adds document registry, docs doctor, Required Reading tiers, and HADARA-dev registry artifact dogfooding.
- Adds managed Markdown section discovery and hash-guarded patch plans.
- Hardens `docs patch --execute` through the shared atomic text write helper with target-preservation failure coverage.
- Adds dry-run-first docs cleanup status marking and archive planning without moving or deleting historical files by default.
- Preserves release, publish, Docker, PyPI, MCP write, and shell execution boundaries.

Boundaries:

- T-0315 prepared stable `hadara@0.3.0` source metadata, release docs, and release readiness evidence.
- T-0316 published stable `hadara@0.3.0` to npm through the approval-gated helper, verified `npm view` returned `0.3.0`, and did not request a GitHub Release draft.
- This release is not a full agent runtime, Rack/enterprise release, broad document rewrite engine, automatic historical deletion release, or release automation expansion.
- Publish mutation, GitHub Release creation, Docker image publishing, and PyPI publication remain explicit operator-approved actions.

## 0.3.0-rc.2

Release candidate published after the `0.3.0-rc.1` installed-package recycle found workflow UX issues in fresh init, task completion, Required Reading, and migration safety.

Highlights:

- Adds `.hadara/context/HADARA_CONTEXT.md` as a generated and migration-managed project context anchor so fresh projects and migrated projects have a compact current-state entry point.
- Clarifies documentation timing and write coordination in root and generated workflow docs: keep capsule docs current during implementation, parallelize read-only discovery/validation, and serialize evidence, shared-doc, before-hash, finish/close, and release writes.
- Preserves human-authored Task Board `Notes` and extra cells when `task finish --execute` updates command-owned task row fields.
- Adds actionable remediation hints to harness, ready, and close blockers while preserving existing issue codes.
- Documents semantic Required Reading tiers and exposes additive `tier` metadata from `docs required-reading --json`.
- Hardens `protocol migrate --execute` so project-scoped multi-file migration writes are preflighted, prepared, committed, and rolled back on failure.
- Writes `docs mark --execute` registry updates through temp-file/rename atomic writes.
- Adds project-root containment validation to the shared atomic text write helper so future callers cannot escape through parent traversal or absolute outside paths.

Boundaries:

- T-0310 prepared `hadara@0.3.0-rc.2` source metadata, release docs, and release readiness evidence; the operator then ran the approval-gated helper, published to npm, and verified `npm view` returned `0.3.0-rc.2`.
- T-0311 added atomic helper path-containment hardening before publish/recycle.
- Post-publish installed-package recycle is deferred to T-0312 after `hadara@0.3.0-rc.2` is visible on npm.
- GitHub Release creation remains optional; Docker image publishing, PyPI publishing, installer execution, and MCP release/package execution remain deferred.

## 0.3.0-rc.1

Release candidate published after the 0.3.0-rc.0 publish exposed two adoption problems: existing projects need a safe path onto the new 0.3 protocol surface, and npm package discovery metadata must be present in the published tarball before the next registry mutation.

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

- npm publish was completed as an operator-confirmed release mutation through the T-0301 helper; `npm view` verified `hadara@0.3.0-rc.1`.
- Protocol migration is scoped and hash-guarded; it is not a broad historical rewrite engine and does not delete archived or superseded documents.
- GitHub Release creation remains optional and was not requested during the npm publish helper run; Docker image publishing, PyPI publishing, and installer mutation remain deferred.

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
