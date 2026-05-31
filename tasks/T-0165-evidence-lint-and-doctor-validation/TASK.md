# T-0165 Evidence Lint and Doctor Validation

## Metadata

| Field | Value |
|---|---|
| ID | T-0165 |
| Title | Evidence Lint and Doctor Validation |
| Status | Done |
| Created | 2026-05-31 |
| Updated | 2026-05-31 |

## Goal

| Goal | Notes |
|---|---|
| Add early evidence linting. | Catch malformed or hand-edited Task Capsule evidence before final close validation. |

## Scope

| In Scope | Reason |
|---|---|
| Add `hadara evidence lint --task <id> --json`. | Provides a focused read-only evidence drift report. |
| Surface lint failures in task protocol doctor. | Agents see evidence enum/schema drift before done-level harness. |
| Document close/evidence fixed-point rules. | Prevent validation evidence loops and manual JSONL edits. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Execute close or status updates. | Reserved for later close capsules. |
| Add shell-capturing evidence command. | Higher-risk command execution UX is deferred. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-05-31T06:13:49.357Z | Draft | Initial task scaffold. | Task created by HADARA CLI. |
| 2026-05-31T06:13:49.357Z | Done | Evidence lint and task doctor integration implemented and documented. | Focused Docker checks passed. |
