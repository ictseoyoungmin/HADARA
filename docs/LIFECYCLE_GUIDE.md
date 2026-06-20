# LIFECYCLE_GUIDE

This guide is the short operational path for ordinary HADARA Task Capsule work. It uses the command vocabulary from `src/services/capability-registry.ts`; `hadara help lifecycle --json` is the machine-readable projection.

## Primary Lifecycle

| Order | Stage | Command ID | Command | Write Boundary | When |
|---|---|---|---|---|---|
| 1 | discover | `task.next` | `hadara task next --json` | `read-only` | At session start or after completing a task. |
| 2 | create | `task.create` | `hadara task create "..." --json` | `task-capsule-create` | When no suitable Task Capsule exists. |
| 3 | inspect | `task.status` | `hadara task status --task T-XXXX --json` | `read-only` | Before editing, validating, or closing a capsule. |
| 4 | evidence | `evidence.add-command` | `hadara evidence add-command --task T-XXXX --summary "..." --result passed --json` | `evidence-append` | After meaningful validation or work proof. |
| 5 | phase-check | `task.lifecycle` | `hadara task lifecycle --task T-XXXX --json` | `read-only` | When the agent needs a compact phase and next action. |
| 6 | finalize-review | `task.finalize` | `hadara task finalize --task T-XXXX --json` | `read-only` | After implementation, evidence, capsule docs, and tracked state docs are ready. |
| 7 | finalize-execute | `task.finalize` | `hadara task finalize --task T-XXXX --execute --plan-hash <hash> --json` | `task-status-bookkeeping` + `close-evidence-append` | After reviewing the current plan hash and write boundaries. |
| 8 | handoff | `handoff.update` | `hadara handoff update --task T-XXXX --json` | `shared-doc-write` | Before stopping after meaningful progress or completion. |

## Diagnostics

Diagnostics explain blockers. They do not replace the primary lifecycle.

| Command ID | Use When |
|---|---|
| `evidence.lint` | Evidence records or semantic proof are unclear. |
| `proof.status` | You need a compact proof/readiness summary for one task. |
| `proof.explain` | Proof status is stale, weak, or confusing. |
| `ci.gate` | You need an aggregated advisory or strict project/task gate. |
| `protocol.doctor` | Protocol docs, task board rows, or profile state may be inconsistent. |
| `state.verify` | Shared task/state projection looks inconsistent or needs concise drift evidence. |
| `harness.validate` | `task finalize` or low-level `task ready` reports format or done-level blockers. |

## Low-Level Proof Boundaries

`task finalize` is the default 0.3.3 agent-facing close path. The underlying proof-boundary commands remain available for debugging, recovery, and command implementation work:

| Command ID | Boundary |
|---|---|
| `task.finish` | Bounded `TASK.md` and `docs/TASK_BOARD.md` status bookkeeping. |
| `task.ready` | Done-level readiness check with no writes. |
| `task.close` | Close evidence dry-run/append only. |
| `task.audit-close` | Read-only close evidence audit. |

## Advanced Families

Release/package, dev validation, UI, integration, installer, and deterministic agent-loop commands are not part of ordinary capsule work. Use `hadara help family <family>` or `hadara commands --json` when a task explicitly needs one of those surfaces.

| Family | Boundary |
|---|---|
| `release-package` | Release/package capsules only. |
| `dev-validation` | HADARA-dev validation or replay work only. |
| `ui` | Operator console or TUI observation work only. |
| `integrations` | Hermes/MCP/tool-discovery integration work only. |
| `agent-loop` | Deterministic harness or local agent-loop work only. |
| `install` | Installer planning work only. |
| `advanced` | Low-level compatibility or remediation work only. |

## Rules

`task status` success is not readiness. Use `task lifecycle` or `task finalize` for agent-facing lifecycle state.

`task complete` is a read-only workflow compressor. It must not execute lifecycle steps.

`task finish` may update only bounded task status bookkeeping unless a future managed-section phase explicitly expands it.

`task close --execute` appends close evidence only. It does not update Project State, Agent Handoff, or broad docs.

Release commands and `dev docker-check` are task-context-specific surfaces, not ordinary lifecycle requirements.
