# T-0315 Stable 0.3.0 Release Readiness Preparation

## Metadata

| Field | Value |
|---|---|
| ID | T-0315 |
| Title | Stable 0.3.0 Release Readiness Preparation |
| Status | In Progress |
| Created | 2026-06-14 |
| Updated | 2026-06-14 |

## Goal

| Goal | Notes |
|---|---|
| Prepare stable `hadara@0.3.0` source readiness. | Update stable-release metadata/docs and refresh release readiness evidence after rc.2 recycle, HADARA-dev docs registry dogfooding, and docs patch atomic write hardening. |

## Scope

| In Scope | Reason |
|---|---|
| Bump package metadata to `0.3.0`. | Stable publish requires a distinct semver version; rc.2 cannot be republished. |
| Update README, release notes, release readiness, and helper guidance. | Package-facing and operator-facing docs must describe stable target/readiness without claiming publish before T-0316. |
| Refresh full validation, stable-surface smokes, fresh-init smokes, managed patch smoke, protocol migration smoke, lifecycle dogfood, and release readiness evidence. | Stable readiness must prove the current source state without registry mutation. |
| Close and audit this readiness capsule. | The release readiness proof must itself be evidence-backed. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| `npm publish`. | Belongs to T-0316 approval-gated publish. |
| GitHub Release creation or publication. | Optional secondary target, approval-gated. |
| Docker image build/push. | Deferred release target. |
| PyPI/TestPyPI publish. | Python bridge remains a separate preview line. |
| New feature work. | Stable readiness freezes behavior; it does not expand scope. |
| Broad docs registry schema redesign. | T-0313 accepted current seed behavior except the known self-registration question. |

## Status

In Progress

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-14 | Draft | Initial task scaffold. | Task created. |
| 2026-06-14 | In Progress | Stable `0.3.0` metadata/docs update started. | Package and release docs edits in progress. |
<!-- hadara:managed:end task-status-history -->
