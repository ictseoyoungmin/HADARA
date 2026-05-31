# T-0163 Task Capsule Upgrade Scaffold Command

## Metadata

| Field | Value |
|---|---|
| ID | T-0163 |
| Title | Task Capsule Upgrade Scaffold Command |
| Status | Done |
| Created | 2026-05-31 |
| Updated | 2026-05-31 |

## Goal

| Goal | Notes |
|---|---|
| Add dry-run-first Task Capsule scaffold upgrade command. | Provide a non-destructive way to insert missing v2 Task Capsule frame sections. |

## Scope

| In Scope | Reason |
|---|---|
| Add `hadara task upgrade-scaffold --task <id> --json [--execute]`. | Strict Phase 2 plan included a scaffold migration helper. |
| Add planning/execution service with safe write checks. | Execute mode must preserve user prose and use before-hash/existence checks. |
| Add fixture-level JSON schema and tests. | The new JSON surface should be machine-readable and validated in focused tests. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Mass-migrate historical capsules. | Command operates on one explicit task only. |
| Delete or rewrite user-authored content. | Upgrade is append/create-only and skips ambiguous semantic frames. |
| Change done-level validation compatibility for legacy frames. | Existing validation behavior remains. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-05-31T05:07:27.373Z | Draft | Initial task scaffold. | Task created by HADARA CLI. |
| 2026-05-31T05:07:27.373Z | Done | Task upgrade-scaffold command implemented and validated. | Focused/full Docker checks and built CLI smoke passed. |
