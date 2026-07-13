# PROJECT_STATE

<!-- hadara:managed:start current-state-canon {"schema":"hadara.managedSection.v1","owner":"current-state.projection","kind":"single-block","mode":"replace","version":1,"required":true,"closeSourceRole":"included"} -->
## Canonical Current State

This section is projected from `.hadara/state/current.json`. Edit the structured state, then use the existing init-upgrade projection path; do not hand-edit this block.

| Field | Value |
|---|---|
| Current Release | 0.4.5 |
| Latest Completed Task | T-0599 0.4.5 installed-candidate multi-shape brownfield dogfood |
| Active Task | None |
| Next Work | 0.4.5 release readiness recycle |
| Next Work State | candidate |
| Operator Guidance | Recycle 0.4.5 release readiness from current source after T-0598 runtime hardening and T-0599 installed-candidate dogfood. Do not publish from stale T-0597 evidence. |
| Validation Baseline | T-0599 verified the 0.4.5 installed candidate across TypeScript service, Python/data, and governed web monorepo brownfield fixtures: dry-run adoption, explicit reviewed execute, docs doctor, baseline validation evidence, and finalize closed-valid all passed. |

### Current Known Problems

| Issue | State | Operator Guidance |
|---|---|---|
| Task-scoped context pack is about 8-10s on the mounted WSL repository. | watch | Prefer bounded status/session paths; revisit performance only with an explicit trust/cache design. |
| Explicit live graph and context reads remain filesystem-sensitive. | watch | Warm cache first and opt into broad live diagnostics deliberately. |
| Tool-host child process launch can return EPERM while direct commands pass. | active | Run the command directly, then record it through validation run --direct-result. |
| Release artifact git-status preflight and full dev Docker workspace copy can exceed useful latency on the mounted WSL workspace. | watch | Use the clean publish ext4 worktree for release artifacts and treat the direct /workspace Docker build path as the fallback when sync-copy stalls. |
<!-- hadara:managed:end current-state-canon -->

## Ownership

This document is the compact human projection for product and phase context.
The six current-state facts live in `.hadara/state/current.json`; this document is not their prose source or a completed-task log.

## Product

HADARA — Local-first evidence control plane for trustworthy agentic development

## Metadata

| Field | Value |
|---|---|
| HADARA Profile | governed |
| Branch | main |

## Current Phase

v0.4.5 release readiness is paused after reviewer feedback. T-0598 closed brownfield adoption safety gaps and T-0599 passed installed-candidate dogfood across multiple brownfield project shapes; T-0600 must now recycle release readiness from current source.

| Stage | State | Purpose |
|---|---|---|
| P0 Currentness integrity | Done | Align next-work selection, active docs, and validation fixtures. |
| P1 Current-state ownership | Done | Separate compact current facts from historical narrative. |
| P2 Product compression | Done | Freeze capability growth and measure the primary workflow. |
| P3 Profile toy validation | Done | Dogfood all profiles and archive stale documents/specs; external/delegated validation was completed for v0.4.4. |

## Current Capabilities

| Area | Current State |
|---|---|
| Task lifecycle | Status-first Task Capsules with validation evidence and guarded finalize to `closed-valid`. |
| Evidence | Canonical append-only `evidence.jsonl`, generated `EVIDENCE.md`, v2 durable ids, resolution and close proof. |
| Context | Session start, task-scoped context pack/slice, graph/code index, bounded cache-backed reads. |
| Documents | Registry/read maps, required-reading tiers, docs doctor, managed sections, safe dry-run-first patches. |
| Operations UI | Read-only Dashboard and TUI over shared read models. |
| Integrations | Read-only MCP by default; narrow approval-recorded evidence attach; Hermes context export. |
| Release | Package/clean-checkout smoke, artifact, gate, dry-run, and approval-gated publish planning. |
| Deferred | Full agent controller, real provider default execution, broad MCP writes/shell, cloud workers, private evidence encryption. |

## Historical Index

| History Type | Path | Use |
|---|---|---|
| Pre-P1 project state snapshot | `docs/history/PROJECT_STATE_PRE_T0558.md` | Full pre-compaction project narrative through T-0557. |
| Pre-P1 handoff snapshot | `docs/history/AGENT_HANDOFF_PRE_T0558.md` | Full pre-compaction handoff, known-problem, and validation tables. |
| Documentation archive map | `docs/archive/README.md` | Completed specs, historical logs, and old-to-new path mapping. |
| Completed task handoff history | `docs/HANDOFF_HISTORY.md` | Older completed-task summaries. |
| Validation history | `docs/VALIDATION_HISTORY.md` | Older accumulated validation observations. |
| Task queue | `docs/TASK_BOARD.md` | Status and capsule path for every task. |
| Development sequence | `docs/DEVELOPMENT_SLICES.md` | Slice ordering and done evidence. |
| Per-task proof | `tasks/T-*/evidence.jsonl` | Canonical task evidence. |

## Single Source of Truth

| Concern | Source |
|---|---|
| Release/task continuity, next intent, current problems, validation baseline | `.hadara/state/current.json` |
| Product and phase projection | `docs/PROJECT_STATE.md` |
| Next-agent continuity projection | `docs/AGENT_HANDOFF.md` |
| Task queue | `docs/TASK_BOARD.md` |
| Active task contract | `tasks/T-*/TASK.md` |
| Canonical task evidence | `tasks/T-*/evidence.jsonl` |
| Document classification and routing | `.hadara/docs-registry.json` |
| Primary lifecycle growth/invocation budget | `docs/PRIMARY_WORKFLOW_BUDGET.md` |
