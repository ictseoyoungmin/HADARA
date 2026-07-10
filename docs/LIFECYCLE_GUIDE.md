# LIFECYCLE_GUIDE

This guide is the short operational path for ordinary HADARA 0.4.2 Task Capsule work. The machine-readable projection is `hadara help lifecycle --json`; the normative growth and invocation limit is `docs/PRIMARY_WORKFLOW_BUDGET.md`.

## Primary Lifecycle

| Order | Stage | Command ID | Command | Write Boundary | When |
|---|---|---|---|---|---|
| 1 | inspect | `task.status` | `hadara task status --json` | `read-only` | At session start, select the next bounded action. |
| 2 | create | `task.create` | `hadara task create "..." --json` | `task-capsule-create` | When no suitable capsule exists. |
| 3 | inspect | `task.status` | `hadara task status --task T-XXXX --json` | `read-only` | After selecting or creating a capsule and at meaningful loop boundaries. |
| 4 | validation | `validation.run` | `hadara validation run --task T-XXXX --check "..." -- <command>` | `external-subprocess` | Execute meaningful validation and record durable evidence. |
| 5 | finalize-review | `task.finalize` | `hadara task finalize --task T-XXXX --json` | `read-only` | Review actionable blockers, deferred checks, plan hash, and pending writes; a clean authored task may still show bounded Task Board finish work. |
| 6 | finalize-execute | `task.finalize` | `hadara task finalize --task T-XXXX --execute --auto --json` | bounded bookkeeping + evidence append | Execute the current guarded close sequence. |

The registry-backed surface contains four unique primary command ids: `task.status`, `task.create`, `validation.run`, and `task.finalize`. The clean post-init invocation budget is six.

## Conditional Evidence Fallback

Use `hadara evidence add-command` only to record an already-run operator-supplied result. It is not the ordinary command-executing validation path.

## Diagnostics

Diagnostics explain blockers; they do not replace the primary lifecycle.

| Command ID | Use When |
|---|---|
| `evidence.lint` | Evidence syntax or semantic proof is unclear. |
| `protocol.doctor` | Protocol docs, task board rows, or profile state may be inconsistent. |
| `status` | Shared task/state projection needs concise drift evidence. |
| `harness.validate` | Full task/finalize diagnostics need isolated done-level explanation. |

## Removed Lifecycle Surfaces

Low-level public lifecycle commands and the old next/show/complete routes were removed from public routing. Current agents use `task status` and `task finalize`; historical command names belong only in migration and audit records.

## Advanced Families

Release/package, dev validation, UI, integration, installer, and low-level remediation commands are task-specific surfaces. Discover them with `hadara help family <family>` or `hadara commands --json` only when the selected capsule needs them.

## Rules

- `task status` success is not readiness; it is the phase-aware cockpit.
- Finish Task Capsule prose, evidence summaries, Task Board, and tracked state docs before finalize execution.
- Finalize dry-run is read-only. Finalize execute preserves bounded bookkeeping and proof append boundaries.
- Shared handoff and project-state edits are deliberate documentation work before close.
- Adding another stable/default-help lifecycle command requires the capability-freeze exception evidence defined in `PRIMARY_WORKFLOW_BUDGET.md`.
