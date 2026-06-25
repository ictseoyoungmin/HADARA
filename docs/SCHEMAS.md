# SCHEMAS

HADARA JSON schemas are contract fixtures for stable external read models. They document the shape external agents can expect and provide a future source for runtime validation, release gates, and MCP/CLI parity checks.

## Current Phase

Schema layer status: planning and fixture registration, with limited active-run, write-preflight, install-plan, feature-smoke, package-smoke, clean-checkout smoke, release-artifact, release closeout, release evidence summary, protocol consistency/remediation/migration, evidence lint, task create, task close/audit-close, task complete flow, task lifecycle, task close repair plan, task finalize plan/execute, handoff suggestion, handoff stale-problems, dev Docker check, task ready, task finish, task next, task upgrade-scaffold, task workbench, runtime version, state projection, dashboard bootstrap, dashboard core, dashboard task-detail, dashboard timeline, Phase 6 common actor/plan/next-action validation, Phase 7.1 command registry/help fixtures, Phase 7.2 lifecycle guide/portfolio audit fixtures, Phase 7.3 document registry/docs doctor fixtures, Phase 7.4 managed patch plan fixtures, and Phase 7.5 docs cleanup fixtures in focused contract tests.

T-0079 added fixture registration only. T-0092 added a lightweight runtime validation API for `hadara.active_run.projection.v1` and `hadara.active_run.resume.v1` because those read models are backed by mutable local state. T-0098 registers and validates `hadara.write.preflight.v1` reports before returning CLI write-boundary preflight output. T-0129 validates `hadara.install.plan.v1` before returning installer dry-run plans. T-0131 validates `hadara.featureSmoke.v1` before returning reduced core feature smoke reports over service/read-model surfaces. T-0132 registers `hadara.packageSmoke.v1` and validates deterministic package-smoke report fixtures before package-smoke dry-run or execution commands exist. T-0137 registers and validates `hadara.releaseArtifact.v1` before returning release artifact builder reports. T-0138 registers `hadara.smokeEvidenceSummary.v1` and `hadara.releaseArtifact.manifest.v1` before release gates read existing evidence records or optional reduced summary artifacts. T-0140 registers and validates `hadara.releaseDryRun.v1` before returning final release dry-run reports. T-0141 registers `hadara.releasePublish.v1` before returning approval-gated publish/deploy readiness reports. T-0159 registers `hadara.protocol.consistency.v1` and `hadara.protocol.remediation.v1` and validates focused service/CLI contract reports, including remediation action hash/existence fields. T-0163 registers `hadara.task.upgrade_scaffold.v1` for dry-run-first non-destructive Task Capsule scaffold frame upgrade reports. T-0240 adds report-level `summary.beforeHash` to protocol remediation and task upgrade-scaffold reports, and execute mode rejects planned writes unless `--before-hash` matches the reviewed dry-run plan. T-0165 registers `hadara.evidence.lint.v1` for early evidence index lint reports. T-0166 registers `hadara.task.close.v1` for close plan reports with loop-boundary metadata. T-0168 registers `hadara.task.ready.v1` for read-only readiness preflight reports. T-0170 registers `hadara.task.audit_close.v1` and clarifies task-close report/source hash semantics. T-0173 registers `hadara.task.workbench.v1` for the read-only Phase 3 task operator console. T-0178 registers `hadara.runtime.version.v1` for read-only CLI origin diagnostics. T-0180 registers `hadara.task.finish.v1` for dry-run-first bounded task finish/status sync reports. T-0181 registers `hadara.task.next.v1` for read-only next-task recommendations. Broad schema validation remains deferred.

T-0197 registers `hadara.dashboard.bootstrap.v1` as the first-paint aggregate read model for status, task summary, active-run/debt summaries, timeline overview, optional compact selected-task proof, source metadata, cache metadata, and issues. T-0199 registers `hadara.dashboard.task_detail.v1` as the selected-task aggregate over workbench, evidence lint, sanitized evidence list, timeline, semantic proof summary, and copyable command guidance. T-0196/T-0200 register and harden `hadara.dashboard.timeline.v1` as the deterministic dashboard timeline read model with normalized evidence identity metadata where available. T-0216 registers `hadara.dashboard.core.v1` as the Phase 5.7 first-actionable projection contract with explicit freshness, completeness, refresh-state, stale-section, and pending-section metadata before projection storage or routes are implemented. These schemas must remain read-only, additive where possible, and free of private raw paths or mutation/execution fields.

T-0253 registers Phase 6 common context fixtures: `hadara.actor_context.v1`, `hadara.plan_context.v1`, and `hadara.next_action.v1`. These are vocabulary/metadata fixtures for future workflow-compression reports, not new command execution surfaces. T-0254 adopts the common actor and next-action vocabulary in task finish, ready, close, and audit-close schemas as additive fields while preserving existing schema ids. T-0255 registers `hadara.task.complete_flow.v1` for read-only completion-flow orchestration over existing lifecycle reports; it has no execute mode. T-0393 registers `hadara.task.lifecycle.v1` for a read-only normalized lifecycle phase report over the same canonical lifecycle reports. T-0394 registers `hadara.task.closeRepairPlan.v1` for read-only close proof repair classifications and next actions. T-0396 registered `hadara.task.finalize.v1` for reviewed lifecycle plans with plan hashes and step write boundaries; T-0397 extends the same fixture to cover guarded execute reports with plan-hash matching, serial execution metadata, stop-on-blocker semantics, and final audit proof. T-0399 adds lazy evaluated/skipped report diagnostics and weak-evidence repair hints to the same finalize fixture without changing its schema id or proof boundaries. T-0256 adds close evidence idempotency/supersedes metadata to `hadara.task.close.v1` and `hadara.task.audit_close.v1` without changing schema ids. T-0257 registers `hadara.handoff.suggestion.v1` for read-only Agent Handoff section-fragment suggestions with target before-hash and coordinator/shared-doc boundary metadata. T-0409 registers `hadara.handoff.staleProblems.v1` for read-only stale known-problem candidate detection over Agent Handoff rows. T-0410 registers `hadara.releaseCloseout.v1` for read-only release closeout planning across release docs, shared state docs, and selected release capsule files. T-0258 registers `hadara.dev.docker_check.v1` for the Docker temp-copy validation wrapper with focused/full modes, explicit dist sync metadata, redacted output, and evidence-ready summaries. T-0259 registers `hadara.task.create.v1` for task creation reports with optional template metadata.

T-0291 registers `hadara.commands.registry.v1` and `hadara.command_help.v1` for Phase 7.1 registry-backed command discovery. These fixtures document the machine-readable command registry and command-help projection. The authoritative command inventory remains `src/services/capability-registry.ts`; schema fixtures document projections rather than creating another inventory.

T-0292 registers `hadara.lifecycle.guide.v1` and `hadara.command_portfolio_audit.v1` for Phase 7.2 lifecycle guidance and command portfolio audit projections. These fixtures document the primary Task Capsule lifecycle, diagnostic side paths, advanced family boundaries, and confusable-command decisions without changing command semantics.

T-0293 registers `hadara.docs.list.v1`, `hadara.docs.doctor.v1`, and `hadara.docs.explain.v1` for Phase 7.3 document registry projections. These fixtures document read-only document classification, registry drift diagnostics, and per-document read/update guidance from `.hadara/docs-registry.json`.

T-0294 registers `hadara.docs.patchPlan.v1` for Phase 7.4 managed Markdown section patch plans and hash-guarded execute reports. This fixture documents the dry-run-first section patch boundary, target before-hash, section body hashes, preview excerpts, and managed patch issue taxonomy.

T-0295 registers `hadara.docs.mark.v1`, `hadara.docs.archivePlan.v1`, and `hadara.docs.requiredReading.v1` for Phase 7.5 document cleanup operations. These fixtures document registry-only status transitions, dry-run archive candidate planning, and effective required-reading exclusions for historical, superseded, and archived documents. T-0308 adds additive semantic `tier` metadata to `hadara.docs.requiredReading.v1` entries with values `current-state`, `task-work`, `conditional-reference`, `historical`, and `excluded`.

T-0299 registers `hadara.protocol.migration.v1` for the 0.3 adoption migration surface. The fixture documents project and selected-task scoped dry-run plans, scaffold detection, action hashes, and before-hash guarded execute reports for existing projects moving onto the Phase 7 command/docs/managed-section surfaces.

T-0322 registers `hadara.stateProjection.v1` for the Phase 8.4 read-only state consistency projection over Task Board rows, Task Capsule status/plan/handoff/close evidence, Project State, Agent Handoff, Development Slices, docs registry, and release readiness presence. This is a service/read-model fixture; CLI, protocol doctor, and CI advisory exposure are separate rollout work.

T-0353 registers `hadara.codeIndex.v1` for the 0.3.3 C2 Code Link Layer foundation. This fixture documents read-only code index reports over source, test, fixture, script, config, symbol, and edge candidates. T-0353 implemented schema/runtime registration plus deterministic ignore rules and file discovery; T-0354 through T-0357 added imports/exports, symbols, command hints, and test/evidence relation edges; T-0358 projects those internal code index results into `hadara.contextGraph.v1` when `context graph --include-code` is requested. T-0359 adds explicit code-index budget metadata and warning-level degraded partial output for file-count, total-byte, and single-file read limits. Dedicated public `hadara code` commands and persistent context cache remain deferred.

T-0361 registers `hadara.contextPack.v1` for the 0.3.3 C3 Context Pack foundation. This fixture documents bounded task-scoped context pack reports with `readFirst`, `readIfNeeded`, `doNotReadByDefault`, validation suggestions, write-boundary hints, slice candidates, known problems, state projection summary, source summary, cache metadata, and issue taxonomy. T-0362 exposes the read-only public `hadara context pack --task T-XXXX --json` CLI over the current graph; T-0390 hardens explicit-range slice candidates so single-line graph anchors become bounded source windows while real multi-line ranges are preserved.

T-0369 registers `hadara.contextSlice.v1` for the 0.3.3 C4 Context Slice core, and T-0370 completes the remaining symbol-neighborhood and context-pack candidate strategies. T-0372 hardens the same schema contract so byte-budget overflow returns `ok:false` with `CONTEXT_SLICE_TOO_LARGE` and no raw `slices[]` text, and `.hadara/local/**` is rejected as local derived state rather than canonical source text. This fixture documents read-only original-text slices from one explicit project file, with source hashes, line bounds, explicit-range/tail/keyword-window/managed-section/symbol-neighborhood/context-candidate strategies, safety issues, candidate-not-found diagnostics, confidence metadata, and bounded payload summaries.

T-0378 registers `hadara.sessionStart.v1` for the bounded C5 Session Start MVP. This fixture documents a read-only startup packet composed from a bounded no-live context-pack envelope by default, or an explicit live context pack when `--live` is supplied, plus current-state summary, lifecycle command guidance, known problems, source summary, cache metadata, degraded summary, and propagated context-pack issues. The public `hadara session start --json` command does not warm cache, append evidence, run validation, read raw slices, or mutate project state.

T-0363 registers `hadara.context.sourceManifest.v1` for the 0.3.3 C6.1 source manifest foundation. This fixture documents metadata-first project-relative source discovery, source kind and extractor-key classifications, budget/degraded output, stable manifest hashes, optional carried content hashes, and comparison inputs for future cache invalidation. T-0364 registers `hadara.context.cacheRecord.v1` and `hadara.context.cacheStatus.v1` for the C6.2 cache store/status foundation. These fixtures document cache record envelopes and read-only `hadara context cache status --json` reports for source-manifest hit, miss, stale, and corrupt states. T-0366 registers `hadara.context.cacheWarm.v1` for the C6.3 warm phase 1 command. This fixture documents dry-run-first source-manifest cache writes through `hadara context cache warm [--execute] --json`; graph/code-index/context-pack/context-slice cache consumption remains deferred.

## Registry

Schema fixtures live under `src/schemas/`.

The registry fixture is `src/schemas/schema-index.json`.

Each registry entry uses:

| Field | Meaning |
|---|---|
| `id` | Stable HADARA schema id. It should match the report `schemaVersion`. |
| `path` | Repository-relative path to the JSON Schema fixture. |
| `status` | `fixture` for documented but not runtime-enforced schemas; future values may include `enforced` or `deprecated`. |
| `owner` | The owning source area, such as `services/evidence-list` or `hermes/context-export`. |
| `notes` | Short guidance for current limitations or future work. |

Initial fixtures:

| Schema ID | File | Status | Notes |
|---|---|---|---|
| `hadara.actor_context.v1` | `src/schemas/actor-context.schema.json` | fixture | Documents the common actor/run context for Phase 6 reports. |
| `hadara.command_help.v1` | `src/schemas/command-help.schema.json` | fixture | Documents registry-backed command-help projection metadata. |
| `hadara.command_portfolio_audit.v1` | `src/schemas/command-portfolio-audit.schema.json` | fixture | Documents the Phase 7.2 command portfolio audit projection over canonical, alias, diagnostic, advanced, dev-only, and release-only decisions. |
| `hadara.commands.registry.v1` | `src/schemas/commands-registry.schema.json` | fixture | Documents `hadara commands --json` machine-readable command registry reports. |
| `hadara.codeIndex.v1` | `src/schemas/code-index.schema.json` | fixture | Documents the C2 read-only internal code index report used by `context graph --include-code`, including budget/degraded metadata; dedicated public code commands remain future work. |
| `hadara.context.cacheRecord.v1` | `src/schemas/context-cache-record.schema.json` | fixture | Documents C6 cache record envelopes keyed by manifest hash, source subset hash, extractor versions, and projection schema version. |
| `hadara.context.cacheStatus.v1` | `src/schemas/context-cache-status.schema.json` | fixture | Documents read-only `hadara context cache status --json` reports for source-manifest cache hit, miss, stale, and corrupt states. |
| `hadara.context.cacheWarm.v1` | `src/schemas/context-cache-warm.schema.json` | fixture | Documents dry-run-first `hadara context cache warm [--execute] --json` reports for source-manifest cache population; graph/code-index/context-pack/context-slice cache writes remain deferred. |
| `hadara.context.sourceManifest.v1` | `src/schemas/context-source-manifest.schema.json` | fixture | Documents C6.1 metadata-first source discovery manifests for context graph, code index, cache invalidation, and future warm paths. |
| `hadara.contextPack.v1` | `src/schemas/context-pack.schema.json` | fixture | Documents the C3 bounded context pack read model over C1/C2 graph output, including ranking buckets, item-level raw-slice source access metadata, item source hashes that prefer current raw-sliceable file text when available, validation/write-boundary hints, bounded source-window slice candidates, source summary, and cache metadata; public CLI exists, while raw text retrieval is handled by `hadara.contextSlice.v1`. |
| `hadara.contextSlice.v1` | `src/schemas/context-slice.schema.json` | fixture | Documents the C4 read-only raw context slice report over explicit project files and context-pack candidates, including line bounds, original text, source hash, strategy, confidence, bounded summary, byte-budget hard failures, local-state path rejection, and safety issues. |
| `hadara.sessionStart.v1` | `src/schemas/session-start.schema.json` | fixture | Documents the bounded C5 read-only startup packet over context pack, state summary, lifecycle commands, known problems, source/cache/degraded metadata, and propagated issues. |
| `hadara.docs.doctor.v1` | `src/schemas/docs-doctor.schema.json` | fixture | Documents `hadara docs doctor --json` registry, profile, required-reading, and active-link diagnostics. |
| `hadara.docs.explain.v1` | `src/schemas/docs-explain.schema.json` | fixture | Documents `hadara docs explain --path <path> --json` per-document classification and guidance reports. |
| `hadara.docs.list.v1` | `src/schemas/docs-list.schema.json` | fixture | Documents `hadara docs list --json` document registry list and filter reports. |
| `hadara.docs.mark.v1` | `src/schemas/docs-mark.schema.json` | fixture | Documents `hadara docs mark --json` registry-only cleanup status transition reports. |
| `hadara.docs.archivePlan.v1` | `src/schemas/docs-archive-plan.schema.json` | fixture | Documents `hadara docs archive --json` dry-run archive candidate plans without file moves. |
| `hadara.docs.patchPlan.v1` | `src/schemas/docs-patch-plan.schema.json` | fixture | Documents `hadara docs patch --json` managed section dry-run and hash-guarded execute reports. |
| `hadara.docs.requiredReading.v1` | `src/schemas/docs-required-reading.schema.json` | fixture | Documents `hadara docs required-reading --json` effective default reading after cleanup exclusions, including additive semantic `tier` metadata. |
| `hadara.lifecycle.guide.v1` | `src/schemas/lifecycle-guide.schema.json` | fixture | Documents `hadara help lifecycle --json` lifecycle guide reports. |
| `hadara.plan_context.v1` | `src/schemas/plan-context.schema.json` | fixture | Documents dry-run plan metadata including affected files, optional before-hash, idempotency key, and `reviewed:false`. |
| `hadara.next_action.v1` | `src/schemas/next-action.schema.json` | fixture | Documents structured next-action records with write-boundary, actor-role, before-hash, and stale-plan guidance. |
| `hadara.evidence.list.v1` | `src/schemas/evidence-list.schema.json` | fixture | Mirrors the shared evidence list read model. |
| `hadara.evidence.lint.v1` | `src/schemas/evidence-lint.schema.json` | fixture | Documents read-only evidence index lint reports for early Task Capsule evidence drift detection. |
| `hadara.context.export.v1` | `src/schemas/context-export.schema.json` | fixture | Documents MCP memory-mode context export. |
| `hadara.tools.list.v1` | `src/schemas/tools-list.schema.json` | fixture | Documents capability discovery surfaces and disabled surfaces. |
| `hadara.active_run.projection.v1` | `src/schemas/active-run-projection.schema.json` | fixture | Documents active-run projection and degraded local-state warnings. |
| `hadara.active_run.resume.v1` | `src/schemas/active-run-resume.schema.json` | fixture | Documents read-only resume guidance. |
| `hadara.releaseGate.v1` | `src/schemas/release-gate.schema.json` | fixture | Documents advisory and strict release gate reports. |
| `hadara.privateEvidence.v1` | `src/schemas/private-evidence.schema.json` | fixture | Documents private portable-store manifest records without private raw content or source paths. |
| `hadara.event.v1` | `src/schemas/event.schema.json` | fixture | Documents structured redacted event records embedded in private audit JSONL. |
| `hadara.protocol.consistency.v1` | `src/schemas/protocol-consistency.schema.json` | fixture | Documents read-only protocol doctor reports for task, docs, profile, and all scopes. |
| `hadara.protocol.migration.v1` | `src/schemas/protocol-migration.schema.json` | fixture | Documents dry-run-first 0.3 protocol migration plans for existing project and selected Task Capsule scopes. |
| `hadara.protocol.remediation.v1` | `src/schemas/protocol-remediation.schema.json` | fixture | Documents dry-run-first protocol remediation plans, report-level before-hash guards, and bounded execute reports. |
| `hadara.task.upgrade_scaffold.v1` | `src/schemas/task-upgrade-scaffold.schema.json` | fixture | Documents dry-run-first non-destructive Task Capsule scaffold frame upgrade reports with before-hash execute guards. |
| `hadara.task.close.v1` | `src/schemas/task-close.schema.json` | fixture | Documents task close plan and execute reports with close-evidence loop-boundary metadata, diagnostic/source hashes, append result paths, and idempotency/supersedes write metadata. |
| `hadara.task.closeRepairPlan.v1` | `src/schemas/task-close-repair-plan.schema.json` | fixture | Documents read-only close repair classifications, causes, hash metadata, and repair next actions. |
| `hadara.task.complete_flow.v1` | `src/schemas/task-complete-flow.schema.json` | fixture | Documents read-only task completion flow reports with stage, primary next action, lifecycle steps, shared-doc state counts, and conflicts. |
| `hadara.task.finalize.v1` | `src/schemas/task-finalize.schema.json` | fixture | Documents finalize dry-run plans and guarded execute reports with plan hashes, lifecycle steps, write boundaries, expected write paths, execution metadata, evaluated/skipped report diagnostics, evidence-quality repair hints, and close audit proof. |
| `hadara.task.lifecycle.v1` | `src/schemas/task-lifecycle.schema.json` | fixture | Documents read-only normalized lifecycle phase reports with checks, satisfied state, blockers, repair metadata, and one primary next action. |
| `hadara.task.create.v1` | `src/schemas/task-create.schema.json` | fixture | Documents task create reports with optional Task Capsule template metadata. |
| `hadara.handoff.suggestion.v1` | `src/schemas/handoff-suggestion.schema.json` | fixture | Documents read-only Agent Handoff section-fragment suggestions with target before-hash and coordinator/shared-doc boundary metadata. |
| `hadara.handoff.staleProblems.v1` | `src/schemas/handoff-stale-problems.schema.json` | fixture | Documents read-only Agent Handoff stale known-problem candidate detection. |
| `hadara.dev.docker_check.v1` | `src/schemas/dev-docker-check.schema.json` | fixture | Documents the Docker temp-copy validation wrapper with focused/full modes, explicit dist sync, redacted output, and evidence-ready summaries. |
| `hadara.task.audit_close.v1` | `src/schemas/task-audit-close.schema.json` | fixture | Documents read-only close audit reports for close evidence presence, shape, post-close hash drift, latest non-superseded proof id, superseded proof ids, and duplicate counts. |
| `hadara.task.ready.v1` | `src/schemas/task-ready.schema.json` | fixture | Documents read-only task readiness preflight reports before close. |
| `hadara.task.finish.v1` | `src/schemas/task-finish.schema.json` | fixture | Documents dry-run-first bounded Task Capsule finish/status sync reports. |
| `hadara.task.next.v1` | `src/schemas/task-next.schema.json` | fixture | Documents read-only next-task recommendation reports from handoff, slices, Task Board fallback, and backlog state. |
| `hadara.task.workbench.v1` | `src/schemas/task-workbench.schema.json` | fixture | Documents read-only Phase 3 task status/workbench reports and normalized next actions. |
| `hadara.runtime.version.v1` | `src/schemas/runtime-version.schema.json` | fixture | Documents read-only CLI origin, package/git/node metadata, and build freshness diagnostics. |
| `hadara.stateProjection.v1` | `src/schemas/state-projection.schema.json` | fixture | Documents the Phase 8.4 read-only state consistency projection report. |
| `hadara.dashboard.bootstrap.v1` | `src/schemas/dashboard-bootstrap.schema.json` | fixture | Documents the first-paint Dashboard aggregate over existing read models with disabled cache metadata, optional compact selected-task proof, and no deep evidence payload. |
| `hadara.dashboard.core.v1` | `src/schemas/dashboard-core.schema.json` | fixture | Documents the Phase 5.7 first-actionable Dashboard projection contract with freshness/completeness metadata and cheap core state. |
| `hadara.dashboard.task_detail.v1` | `src/schemas/dashboard-task-detail.schema.json` | fixture | Documents selected-task Dashboard detail aggregate over workbench, evidence lint/list, timeline, proof summary, and copyable read-only command guidance. |
| `hadara.dashboard.timeline.v1` | `src/schemas/dashboard-timeline.schema.json` | fixture | Documents deterministic Dashboard timeline events with read-only event metadata and normalized evidence identity fields where available. |
| `hadara.write.preflight.v1` | `src/schemas/write-preflight.schema.json` | fixture | Documents read-only CLI write-boundary preflight reports. |
| `hadara.install.plan.v1` | `src/schemas/install-plan.schema.json` | fixture | Documents future installer dry-run planning reports without performing install mutation; target paths are redacted public path-reference objects instead of raw strings. |
| `hadara.featureSmoke.v1` | `src/schemas/feature-smoke.schema.json` | fixture | Documents reduced read-only core feature smoke reports for the `core` profile and deferred `release-readiness` profile; installed binary and launcher checks are explicitly false in the current report. |
| `hadara.packageSmoke.v1` | `src/schemas/package-smoke.schema.json` | fixture | Documents reduced npm package-smoke reports, provider metadata, redacted path references, execution markers, artifact metadata, and privacy booleans. |
| `hadara.cleanCheckoutSmoke.v1` | `src/schemas/clean-checkout-smoke.schema.json` | fixture | Documents reduced source-checkout smoke reports for disposable clean-checkout validation without package install, publish, release mutation, or public raw logs. |
| `hadara.releaseArtifact.v1` | `src/schemas/release-artifact.schema.json` | fixture | Documents reduced release artifact build reports for tarball, checksum, manifest, whitelist verification, and no publish/GitHub/Docker mutation. |
| `hadara.releaseCloseout.v1` | `src/schemas/release-closeout.schema.json` | fixture | Documents read-only release closeout planning across release docs, shared state docs, and active release capsule files. |
| `hadara.releaseDryRun.v1` | `src/schemas/release-dry-run.schema.json` | fixture | Documents read-only final release dry-run reports that cross-check evidence artifacts, package version, manifest hash, and descriptor-backed release targets without publish/GitHub/Docker/PyPI mutation. |
| `hadara.releasePublish.v1` | `src/schemas/release-publish.schema.json` | fixture | Documents approval-gated publish/deploy readiness reports with token presence checks, private audit for execute requests, and no publish/GitHub/Docker mutation. |
| `hadara.smokeEvidenceSummary.v1` | `src/schemas/smoke-evidence-summary.schema.json` | fixture | Documents reduced public smoke evidence summary artifacts for package-smoke and clean-checkout smoke attachment. |
| `hadara.releaseArtifact.manifest.v1` | `src/schemas/release-artifact-manifest.schema.json` | fixture | Documents generated release artifact manifest files for tarball hash and package file lists without publish/GitHub mutation. |

Planned dashboard fixtures:

Phase 5.7 follow-up capsules will implement local projection storage, `/api/dashboard/core`, background refresh, incremental task projections, timeline/debt projections, frontend core/heavy merge, and visual/a11y validation over the `hadara.dashboard.core.v1` contract.

Planned Phase 2 fixtures:

None currently.

## Versioning

- Schema ids should match the payload `schemaVersion`.
- Additive fields may be allowed without changing the schema id when the documented required envelope remains compatible.
- Removing fields, changing field meaning, or changing enum semantics requires a new schema id.
- Compatibility booleans may remain in schemas even after newer enum fields exist. For example, `enabledByDefault` remains in `hadara.tools.list.v1` while `availability` carries richer semantics.

## Field Stability Classes

Schema fixtures may classify fields with `x-hadara-field-classes` when a report has active external consumers or compatibility aliases. Classification is documentation-first for now; it does not make fixture schemas release-gate strict.

| Field Class | Meaning | Consumer Guidance |
|---|---|---|
| Stable | Consumers may rely on the field name and meaning within the current schema id. | Breaking changes require a new schema id or an explicit compatibility plan. |
| Additive | Fields or nested properties may be added without changing the schema id. | Consumers should ignore unknown additive fields unless documented otherwise. |
| Compatibility alias | Maintained for existing consumers after a preferred field exists. | New consumers should use the preferred field and treat the alias as legacy-compatible. |
| Deprecated | Field remains temporarily but is planned for removal or replacement. | Consumers should migrate away before the next breaking schema id. |
| Experimental | Field is useful but not yet a stable contract. | Consumers should guard reads and avoid hard dependencies. |

Current classified fields:

| Schema | Field | Class | Preferred Field | Notes |
|---|---|---|---|---|
| `hadara.task.workbench.v1` | `state.closedValid` | Stable |  | Preferred boolean for valid close evidence. |
| `hadara.task.workbench.v1` | `state.closeState` | Stable |  | Preferred enum for close state. |
| `hadara.task.workbench.v1` | `state.closed` | Compatibility alias | `state.closedValid` | Kept for existing task status consumers; new consumers should avoid it. |
| `hadara.task.workbench.v1` | `sources.*` | Additive |  | Source summaries may grow as the workbench composes more read models. |
| `hadara.task.workbench.v1` | `generatedAt` | Experimental |  | Useful for display/debug, but consumers should not use it as identity or ordering authority. |

## Fixture Strictness

Initial report schemas require stable envelope fields such as `schemaVersion`, `command`, `ok`, primary arrays, and `issues`. Record schemas such as `hadara.privateEvidence.v1` require their domain fields instead.

Initial schemas allow additive properties. This keeps the fixtures useful for documentation and future loader design without prematurely blocking read-model extension work.

Schema validation should distinguish three strictness levels:

| Level | Purpose | Unknown fields | Typical use |
|---|---|---|---|
| `fixture` | Documentation and implementation guidance. | Allowed for additive evolution. | Current T-0079 schema fixtures. |
| `contract` | External-agent compatibility checks for stable read models. | Allowed only outside core envelope and documented contract fields. | CLI/MCP parity and compatibility fixtures. |
| `releaseGate` | Pre-release blocking validation. | Policy must be explicit per schema. | Future release/package checks. |

The current `additionalProperties: true` posture is only a fixture-level policy. Do not treat the initial fixtures as release gates until a later capsule defines core-field strictness, required/enum enforcement, and unknown-field handling.

`hadara.install.plan.v1` is intentionally a little stricter for public path fields: `target.prefix` and `target.launcher` are objects with `displayPath` and `pathRedacted: true`, not raw path strings. `mode: execute` is reserved in the schema for future compatibility, but the current dry-run implementation keeps execution disabled and reports `INSTALL_EXECUTION_DISABLED` until a later capsule explicitly authorizes installer mutation.

## Runtime API

The lightweight runtime API exists in `src/core/schema.ts`:

```ts
export interface SchemaValidationResult {
  ok: boolean;
  schemaId: string;
  issues: Array<{
    path: string;
    code: string;
    message: string;
  }>;
}

export function validateSchema(schemaId: string, value: unknown): SchemaValidationResult;
export function loadSchema(schemaId: string): unknown;
```

Current runtime usage is intentionally narrow: active-run projection/resume reports, write-preflight reports, install-plan reports, feature-smoke reports, deterministic package-smoke fixtures, release reports, and focused protocol consistency/remediation contract reports validate against the fixture subset. Future work should keep CLI/MCP transport envelopes separate from shared read-model schemas.

The validator currently covers the JSON Schema keywords used by registered fixtures, including required fields, const, enum, primitive type checks, arrays, object properties, local `$ref`, `oneOf`, string `minLength`, and regex `pattern`.

## TUI Schema Posture

The terminal TUI composes existing read-model schemas instead of introducing a new stable public TUI read-model schema. Deterministic TUI snapshot JSON can be used for tests, but it is a presentation test artifact unless a later capsule explicitly promotes it to a stable contract.

The full TUI mockup parity and HADARA-native runtime design is preserved without omission in `docs/V1_0_IMPLEMENTATION_SCHEMAS.md` under `TUI Mockup Parity / HADARA-Native Runtime Design`. Schema-related TUI requirements from that design are:

```text
source = service by default
cache = internal local read-write only when explicitly enabled
theme = hadara for TTY, no-color for snapshot tests unless specified
auto refresh = off unless specified
```

T-0109 implemented an internal TUI cache record. It remains local acceleration only, not a public read-model schema, fixture-level schema, or release-gated contract.

```json
{
  "schemaVersion": "hadara.tui.cache.v1",
  "projectRoot": ".",
  "generatedAt": "2026-05-26T00:00:00.000Z",
  "sourceSignals": {
    "taskBoard": {
      "mtimeMs": 123456789,
      "size": 4096,
      "hash": "..."
    },
    "tasksDir": {
      "entries": ["T-0107-tui-public-cli-entry-point"],
      "mtimeMs": 123456789
    },
    "handoff": {
      "mtimeMs": 123456789,
      "size": 4096,
      "hash": "..."
    },
    "activeRun": {
      "mtimeMs": 123456789,
      "size": 4096,
      "hash": "..."
    },
    "selectedTask": {
      "mtimeMs": 123456789,
      "size": 4096,
      "hash": "..."
    },
    "selectedEvidence": {
      "mtimeMs": 123456789,
      "size": 4096,
      "hash": "..."
    }
  },
  "taskIndex": [
    {
      "id": "T-0107",
      "title": "TUI Public CLI Entry Point",
      "status": "Done",
      "capsule": "tasks/T-0107-tui-public-cli-entry-point",
      "mtimeMs": 123456789,
      "size": 4096,
      "hash": "..."
    }
  ],
  "model": {
    "schemaVersion": "hadara.tui.read_model.internal.v1"
  }
}
```

Current status of `hadara.tui.cache.v1`:

| Field | Current posture |
|---|---|
| Registry entry | Not registered. |
| Fixture file | Not implemented. |
| Runtime validation | Not implemented. |
| Storage path | Ignored local state under `.hadara/local/tui/read-model-cache.json`. |
| Source-of-truth status | Never source-of-truth; cache only accelerates reads. |
| Public evidence/context status | Must not be attached as evidence or exported in context. |
| Private evidence status | Cache is disabled when private evidence metadata is requested. |

Any future promotion of `hadara.tui.cache.v1` to a registered fixture-level schema or release-gated schema requires a separate strictness decision.

## Evidence Semantics Schema Posture

Phase 4 evidence proof semantics should start as additive read-model/schema work over existing `hadara.evidence.v1` records. A future `hadara.evidence.normalized.v1` shape may be introduced as an internal or fixture-level read model for semantic analysis, but it must not imply persisted writer migration by itself.

Expected first-slice schema posture:

| Surface | Posture |
|---|---|
| `hadara.evidence.v1` | Remains the persisted evidence index format. |
| `hadara.evidence.lint.v1` | Remains the lint report id; semantic summary/issues are additive if implemented. |
| `hadara.evidence.normalized.v1` | Planned read model, not a persisted writer format. |
| `hadara.evidence.v2` | Planned persisted writer format; see `docs/EVIDENCE_V2_WRITER_MIGRATION_PLAN.md` before implementation. |

Evidence semantic schemas must not introduce init scaffold changes, evidence JSONL rewrites, public binary artifact policy, MCP writes, release/package execution, or strict release-gate enforcement in the same slice.

Evidence v2 writer and migration work must be dry-run-first, dual-read compatible, and explicitly opt-in until a later implementation task proves safe writer behavior. The schema registry must not imply that existing v1 evidence has already been migrated.

## Non-Goals

- No schema-based release gate is active yet.
- No MCP write surface is enabled by schemas.
- No shell execution, provider calls, dashboard live APIs, or release/package execution is introduced by this registry.
- No TUI cache fixture or public TUI cache schema is introduced by this registry.
- No private evidence contents or machine-local paths should be included in public schema examples or fixtures.
