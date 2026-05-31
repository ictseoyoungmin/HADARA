# Handoff

## Current State

| Field | Value |
|---|---|
| Task | T-0170 |
| Status | Done |
| Last Updated | 2026-05-31 |

## Last Completed

| Item | Evidence |
|---|---|
| Close hash semantics polished. | Report/source hash fields added; deprecated alias preserved. |
| Execute nextActions polished. | Execute success now reports close evidence appended plus optional audit. |
| Close audit added. | `task audit-close` reports close evidence presence/shape and post-close hash drift. |

## Next Recommended Step

| Step | Reason | Required Reading |
|---|---|---|
| Commit T-0170. | Focused tests, full Docker check, built CLI close/audit smokes, and done harness have passed. | docs/IMPLEMENTATION_SOP.md |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Audit source hash intentionally excludes evidence files. | Close evidence append would otherwise cause immediate drift. | Use evidence lint/doctor for evidence-file coherence and audit source hash for non-evidence close-relevant drift. |
