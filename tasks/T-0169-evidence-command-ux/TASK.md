# T-0169 Evidence Command UX

## Metadata

| Field | Value |
|---|---|
| ID | T-0169 |
| Title | Evidence Command UX |
| Status | Done |
| Created | 2026-05-31 |
| Updated | 2026-05-31 |

## Goal

| Goal | Notes |
|---|---|
| Add command-log evidence writer UX. | Provide a canonical way to record command results without hand-editing JSONL or executing shell commands. |

## Scope

| In Scope | Reason |
|---|---|
| Add `hadara evidence add-command --task <id> --summary <text> --result <result> --json`. | Forces `kind: command-log` through canonical writer. |
| Document no shell execution/capture. | Keeps command execution UX deferred. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Execute commands or capture stdout/stderr. | Deferred `from-command` work. |
| Add new evidence schema. | Reuses existing evidence collect envelope. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-05-31T06:41:02.229Z | Draft | Initial task scaffold. | Task created by HADARA CLI. |
| 2026-05-31T06:41:02.229Z | Done | Evidence command UX implemented and validated. | Focused Docker checks passed. |
