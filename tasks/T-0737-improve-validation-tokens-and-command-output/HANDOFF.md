# Handoff

## Identity

| Field | Value |
|---|---|
| ID | T-0737 |
| Title | Improve validation tokens and command output |
| Status | Done |
| Created | 2026-07-29T19:34 |
| Updated | 2026-07-29T19:39 |

## Last Completed

| Item | Evidence |
|---|---|
| Added canonical `design` source role token and schema/vocabulary coverage. | ev:T-0737:906bfe6fa3c04c47ad3d4319 |
| Kept risk state `Done` invalid and added a focused `Closed` fix hint. | ev:T-0737:906bfe6fa3c04c47ad3d4319 |
| `validation run` now reports bounded child stdout/stderr previews and prints them in non-JSON output. | ev:T-0737:bbab4b01a0854dc0a32da760 |
| TypeScript no-emit passed. | ev:T-0737:a8f99f27c0474e0fbb53b12e |

## Next Recommended Step

| Step | Disposition | Create Task | Reason | Required Reading |
|---|---|---|---|---|
| No further work is queued in this capsule. | terminal | no | Token diagnostics, validation output behavior, focused tests, and evidence are complete. | tasks/T-0737-improve-validation-tokens-and-command-output/TASK.md |

## Carry Forward Warnings

| Warning | Impact | Mitigation |
|---|---|---|
| Validation output previews intentionally include captured child stdout/stderr. | Operators get better debugging output, but commands that print sensitive data may expose it in CLI/JSON output. | Keep previews bounded and avoid storing raw output in evidence summaries; use private/manual evidence for sensitive logs. |
