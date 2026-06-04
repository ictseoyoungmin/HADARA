# T-0241 Reviewer Feedback Docs Alignment

## Metadata

| Field | Value |
|---|---|
| ID | T-0241 |
| Title | Reviewer Feedback Docs Alignment |
| Status | Done |
| Created | 2026-06-04 |
| Updated | 2026-06-04 |

## Goal

| Goal | Notes |
|---|---|
| Align operator docs with reviewer cautions after Evidence v2, task-next, and remediation guard work. | The feedback is accepted; the risk is not code behavior, but operators and consumers misreading the intended defaults. |

## Scope

| In Scope | Reason |
|---|---|
| Clarify evidence migration is operator-selected, per-task, and not a default broad migration. | T-0236 made migration possible, not recommended as a routine action. |
| Clarify `EVIDENCE.md` does not surface persisted v2 ids. | Operators need JSONL/read-model output for durable ids. |
| Clarify `task next` can return `taskId: TBD` and consumers must inspect `sourceKind`, `createCommand`, and `backlog`. | T-0239 intentionally allows handoff work without an existing capsule. |
| Clarify T-0240 dry-run hash UX in SOP/help-facing docs. | Execute-only copy-paste commands fail closed by design. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Code behavior changes. | This capsule is documentation alignment only. |
| Historical evidence migration. | Migration remains operator-selected and outside this task. |
| UI/dashboard/TUI work. | UI work remains paused. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-04 | Draft | Initial task scaffold. | hadara task create |
| 2026-06-04 | In Progress | Scope fixed to reviewer feedback documentation alignment. | Capsule update |
| 2026-06-04 | Done | Accepted reviewer cautions reflected in operator-facing docs. | `rg` caution phrase check and `git diff --check` evidence. |
