# T-0232 TUI Overview Markdown Table Preview Cleanup

## Metadata

| Field | Value |
|---|---|
| ID | T-0232 |
| Title | TUI Overview Markdown Table Preview Cleanup |
| Status | Done |
| Created | 2026-06-03 |
| Updated | 2026-06-03 |

## Goal

| Goal | Notes |
|---|---|
| Remove Markdown table header/delimiter noise from TUI Overview preview text. | Overview cards should show data-row summaries such as Goal/Step/Summary values, not `| Goal | Notes |` or `| Step | Reason |`. |

## Scope

| In Scope | Reason |
|---|---|
| Markdown preview helper. | Skip table headers and summarize table data rows for section previews. |
| Evidence table fallback. | Support evidence tables with more than four columns so Proof fallback does not show header text. |
| Fast TUI handoff status extraction. | Reuse table-aware handoff section parsing so `Next Recommended` cards show data rows. |
| Regression coverage. | Add helper-level and snapshot-level tests for table-backed Overview previews. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Full TUI redesign. | This is a targeted preview cleanup. |
| Dashboard frontend changes. | The reported issue is TUI snapshot/terminal rendering. |
| New persisted document format. | Existing Markdown table-first docs remain source-of-truth. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-03 | Draft | Initial task scaffold. | hadara task create |
| 2026-06-03 | In Progress | Scope fixed to TUI Overview Markdown table preview cleanup. | Task capsule update |
| 2026-06-03 | Done | Finished task capsule. | `hadara task finish --execute` |

