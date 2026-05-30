# T-0154 Project Docs Consistency Doctor

## Metadata

| Field | Value |
|---|---|
| ID | T-0154 |
| Title | Project Docs Consistency Doctor |
| Status | Done |
| Created | 2026-05-30 |
| Updated | 2026-05-30 |

## Goal

| Goal | Notes |
|---|---|
| Add a read-only project-doc protocol consistency doctor. | Extend `hadara protocol doctor` beyond task-scoped `--task` mode so it can report cross-document project drift without remediation writes. |

## Scope

| In Scope | Reason |
|---|---|
| `hadara protocol doctor --scope docs --json` | Provides a project-doc read-only report while preserving the existing task-scoped command. |
| Project docs consistency service checks | Cover Task Board rows versus Task Capsules, latest completed task handoff drift, Required Reading missing-path drift, and required project docs presence. |
| Focused tests and CLI smoke | Prove stable issue codes, exit behavior, and the read-only boundary. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Profile drift remediation hints | Deferred to T-0155. |
| Safe-auto remediation writes | Deferred to T-0156. |
| Protocol schema fixture registration | Deferred to T-0157 after docs/profile/remediation shapes stabilize. |
| Full project-wide `all` aggregation | Keep this slice focused on docs scope; all-scope aggregation can follow after docs/profile checks exist. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-05-30 | Draft | Initial task scaffold. | `hadara task create "Project Docs Consistency Doctor"` |
| 2026-05-30 | Active | Started the next Phase 2 slice after T-0153 task-scoped doctor completion. | Required reading completed. |
| 2026-05-30 | Done | Docs-scope protocol consistency doctor implemented and validated. | Focused tests, full Docker check, built CLI smoke, and done-level harness passed. |
