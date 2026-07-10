# PROJECT_STATE

## Ownership

This document is the compact source for current product, release, phase, and active-task facts.
It is not a completed-task log or validation archive. Use the Historical Index for older detail.

## Product

HADARA - Portable Agentic Development Workbench

## Metadata

| Field | Value |
|---|---|
| HADARA Profile | governed |
| Stable Version | 0.4.2 |
| Branch | main |
| Latest Completed Task | T-0558 Current-state ownership and compact projection |
| Active Task | None; create P2 capsule next |
| Validation Baseline | Docker 149 files / 1034 tests; governed P1 toy lifecycle closed-valid |

## Current Phase

P0-P3 product consolidation after stable 0.4.2.

| Stage | State | Purpose |
|---|---|---|
| P0 Currentness integrity | Done | Align next-work selection, active docs, and validation fixtures. |
| P1 Current-state ownership | Done | Separate compact current facts from historical narrative. |
| P2 Product compression | Next | Freeze capability growth and measure the primary workflow. |
| P3 External-style validation | Planned | Dogfood all profiles and archive stale documents/specs. |

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

## Current Status

- Stable `hadara@0.4.2` and GitHub `v0.4.2` are published and consumer-recycled.
- T-0557 stopped historical `Partial` capsules from becoming primary next-work recommendations.
- Active-document currentness diagnostics cover stale install versions and removed command examples.
- The clean source baseline is 149 test files / 1034 tests with Docker-refreshed `dist`.
- T-0558 established bounded state ownership and preserved pre-compaction snapshots under `docs/history/`.

## Current Known Constraints

| Issue | State | Operator Guidance |
|---|---|---|
| Task-scoped context pack is about 8-10s on the mounted WSL repository. | Watch | Prefer bounded status/session paths; treat sub-3s reads as a future explicit trust/cache decision. |
| Explicit live graph/context reads remain filesystem-sensitive. | Watch | Warm cache first and run broad live diagnostics only when needed. |
| Tool-host child process launch can return `EPERM` while direct commands pass. | Active | Run the command directly, then record through `validation run --direct-result`. |
| `docs doctor --scope links` still sees historical specs as active-looking. | Active | P3 owns archive/classification cleanup; do not treat those warnings as current implementation work. |

## Next Planned Line

1. Create P2 product-compression and primary-workflow measurement capsule.
2. Create P3 external-style multi-profile dogfood and stale-doc archive capsule.
3. Resume release/provider/runtime expansion only from new operator evidence.

## Historical Index

| History Type | Path | Use |
|---|---|---|
| Pre-P1 project state snapshot | `docs/history/PROJECT_STATE_PRE_T0558.md` | Full pre-compaction project narrative through T-0557. |
| Pre-P1 handoff snapshot | `docs/history/AGENT_HANDOFF_PRE_T0558.md` | Full pre-compaction handoff, known-problem, and validation tables. |
| Completed task handoff history | `docs/HANDOFF_HISTORY.md` | Older completed-task summaries. |
| Validation history | `docs/VALIDATION_HISTORY.md` | Older accumulated validation observations. |
| Task queue | `docs/TASK_BOARD.md` | Status and capsule path for every task. |
| Development sequence | `docs/DEVELOPMENT_SLICES.md` | Slice ordering and done evidence. |
| Per-task proof | `tasks/T-*/evidence.jsonl` | Canonical task evidence. |

## Single Source of Truth

| Concern | Source |
|---|---|
| Current product/release/phase/task facts | `docs/PROJECT_STATE.md` |
| Next-agent continuity and live warnings | `docs/AGENT_HANDOFF.md` |
| Task queue | `docs/TASK_BOARD.md` |
| Active task contract | `tasks/T-*/TASK.md` |
| Canonical task evidence | `tasks/T-*/evidence.jsonl` |
| Document classification and routing | `.hadara/docs-registry.json` |
