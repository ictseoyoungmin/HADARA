# PROJECT_STATE

<!-- hadara:managed:start current-state-canon {"schema":"hadara.managedSection.v1","owner":"current-state.projection","kind":"single-block","mode":"replace","version":1,"required":true,"closeSourceRole":"included"} -->
## Canonical Current State

This section is projected from `.hadara/state/current.json`. Edit the structured state, then use the existing init-upgrade projection path; do not hand-edit this block.

| Field | Value |
|---|---|
| Current Release | 0.4.3 |
| Latest Completed Task | T-0578 v0.4.4 pre-release delegated dogfood UX cleanup |
| Active Task | None |
| Next Work | v0.4.4 release readiness |
| Next Work State | candidate |
| Operator Guidance | Prepare v0.4.4 release readiness; optionally run a final delegated candidate-tarball smoke first. |
| Validation Baseline | hadara@0.4.3 plus T-0577 delegated R3 dogfood: Claude Code independently finalized 8 governed-profile capsules; current candidate focused regressions passed for current-state, task-selection, session-start, runtime-version, and docs doctor coverage. |

### Current Known Problems

| Issue | State | Operator Guidance |
|---|---|---|
| Task-scoped context pack is about 8-10s on the mounted WSL repository. | watch | Prefer bounded status/session paths; revisit performance only with an explicit trust/cache design. |
| Explicit live graph and context reads remain filesystem-sensitive. | watch | Warm cache first and opt into broad live diagnostics deliberately. |
| Tool-host child process launch can return EPERM while direct commands pass. | active | Run the command directly, then record it through validation run --direct-result. |
| Release artifact git-status preflight can exceed its 10-second limit on the mounted WSL workspace. | watch | Build release artifacts from a clean ext4 worktree so commit metadata and package contents remain aligned. |
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

v0.4.3 npm/GitHub publication and installed-package recycle are complete; v0.4.4 external validation planning, R1 delegated basic-profile dogfood, R1 generated-doc audit, R1 UX cleanup, R2 standard-profile external validation, and R3 delegated Claude governed-profile validation are complete; v0.4.4 release readiness is next.

| Stage | State | Purpose |
|---|---|---|
| P0 Currentness integrity | Done | Align next-work selection, active docs, and validation fixtures. |
| P1 Current-state ownership | Done | Separate compact current facts from historical narrative. |
| P2 Product compression | Done | Freeze capability growth and measure the primary workflow. |
| P3 Profile toy validation | Done | Dogfood all profiles and archive stale documents/specs; real external-repository validation remains planned for v0.4.4. |

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
