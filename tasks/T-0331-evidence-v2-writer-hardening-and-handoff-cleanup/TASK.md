# T-0331 Evidence v2 Writer Hardening and Handoff Cleanup

## Metadata

| Field | Value |
|---|---|
| ID | T-0331 |
| Title | Evidence v2 Writer Hardening and Handoff Cleanup |
| Status | Done |
| Created | 2026-06-17 |
| Updated | 2026-06-17 |

## Goal

| Goal | Notes |
|---|---|
| Harden Evidence v2 command writer and semantic resolution after T-0330. | Prevent result/outcome contradictions, prevent failed/blocked records from resolving earlier failures, align evidence task directory discovery with T-0325 capsule discovery hardening, and clean stale T-0330 handoff next-step text. |

## Scope

| In Scope | Reason |
|---|---|
| `evidence add-command` result/outcome compatibility guard. | Avoid split-brain proof where Markdown legacy result and v2 outcome disagree. |
| Exact resolution marker outcome guard. | Only passed or recorded later evidence should resolve prior failed/blocked evidence by exact marker. |
| Evidence writer task directory discovery hardening. | Ignore task-like leftovers without `TASK.md`; reject ambiguous same-id capsules. |
| T-0330 handoff cleanup. | Remove stale finish/ready/close/audit next-step wording after close. |
| Operator docs and focused tests. | Make rules discoverable and regression-covered. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Broad evidence migration or Markdown evidence frame rebuild. | T-0331 is a forward-fix hardening slice, not a migration slice. |
| Release or next large phase work. | User explicitly blocked release/large phase until this hardening follow-up is done. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-17 | Draft | Initial task scaffold. | `task create` |
| 2026-06-17 | In Progress | Started T-0331 forward-fix hardening after T-0330 review. | User review request |
| 2026-06-17 | Done | Result/outcome guard, resolution marker guard, writer task-dir hardening, T-0330 handoff cleanup, docs, and validation are complete. | T-0331 focused/full validation and built CLI smoke evidence |
<!-- hadara:managed:end task-status-history -->
