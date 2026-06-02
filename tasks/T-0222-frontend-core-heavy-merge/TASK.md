# T-0222 Frontend Core + Heavy Merge

## Metadata

| Field | Value |
|---|---|
| ID | T-0222 |
| Title | Frontend Core + Heavy Merge |
| Status | Done |
| Created | 2026-06-02 |
| Updated | 2026-06-02 |

## Goal

| Goal | Notes |
|---|---|
| Make the dashboard render core first and merge heavy projected sections as they arrive. | UX should be immediate without pretending stale/offline data is live. |

## Scope

| In Scope | Reason |
|---|---|
| Change frontend loading to prefer `/api/dashboard/core`. | First actionable state should not wait for heavy reads. |
| Merge task-detail, timeline, debt, and proof sections independently. | Heavy sections can arrive after core. |
| Preserve offline/degraded/stale labels and no browser storage. | Governance boundary remains. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| New backend projection routes. | Prerequisite T-0218 through T-0221. |
| New write/action behavior. | Dashboard stays read-only. |
| Visual/a11y final lock. | T-0223. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-02 | Draft | Initial task scaffold for frontend core/heavy merge. | Task created by HADARA CLI. |
| 2026-06-02 | Done | Updated authored frontend data flow to core-first and projection heavy backfills; static bundle build remains blocked and carried to T-0223. | `evidence.add-command` at 2026-06-02T03:38:37.698Z. |
