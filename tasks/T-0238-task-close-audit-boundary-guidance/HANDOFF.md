# Handoff

## Current State

| Field | Value |
|---|---|
| Task | T-0238 |
| Status | Done |
| Last Updated | 2026-06-04 |

## Last Completed

| Item | Evidence |
|---|---|
| Capsule scope fixed to additive close/audit boundary guidance. | TASK.md, PLAN.md, ACCEPTANCE.md, TESTS.md updated. |
| Close/audit report guidance implemented. | `src/task/task-close.ts` adds close `lifecycle` and audit `auditVerdict`; focused suite passed 5 files / 19 tests. |
| Full Docker validation passed. | `npm run dev:docker-sync-build` passed 92 files / 607 tests and refreshed `dist`. |
| Project docs updated. | Project State, Development Slices, and Agent Handoff mention T-0238 and next recommended work. |
| Final workflow passed. | finish dry-run/execute, ready done, close dry-run/execute, and audit-close closed-valid. |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Start task capsule upgrade/remediation dry-run hardening. | Evidence v2, finish advisories, and close/audit boundary guidance are now in place. | docs/AGENT_HANDOFF.md |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Close evidence append changes `evidence.jsonl` after validation. | Treating it as a same-run validation prerequisite creates a fixed-point loop. | Keep validation, close record, and audit as separate phases in report guidance. |
| Broad status docs are still manual. | Close/audit guidance cannot prove Project State or handoff freshness. | Use `task finish` stateDocs advisories and standard handoff updates. |
