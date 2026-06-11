# T-0301 0.3.0-rc.1 final readiness and publish preparation

## Metadata

| Field | Value |
|---|---|
| ID | T-0301 |
| Title | 0.3.0-rc.1 final readiness and publish preparation |
| Status | Done |
| Created | 2026-06-11 |
| Updated | 2026-06-11 |

## Goal

| Goal | Notes |
|---|---|
| Prepare `hadara@0.3.0-rc.1` for operator npm publish from a clean `/tmp` clone. | The helper path must avoid the rc.0 metadata/dry-run cleanup mistakes and provide feature-focused release notes before the operator executes the publish mutation. |

## Scope

| In Scope | Reason |
|---|---|
| Release helper guardrails | Ensure the helper uses the rc.1 release capsule, validates package metadata in the tarball, and supports dry-run followed by execute in the same clean clone. |
| Release-facing docs | Align README, release readiness, and release notes with rc.1 being the next publish candidate while rc.0 remains the currently published package until execution. |
| Release note draft | Provide feature-focused rc.1 notes for operator/GitHub Release use. |
| Validation evidence | Prove the source candidate with local checks and script guard smokes without executing npm publish. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Actual npm publish | Operator-only after this capsule is committed and reviewed. |
| GitHub Release creation | Optional helper path only; no draft is created in this capsule. |
| Docker/PyPI/installer publication | Deferred release targets. |
| New protocol features beyond readiness fixes | Already handled by T-0299/T-0300 or future capsules. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-11 | Draft | Initial task scaffold. | Created by `hadara task create`. |
| 2026-06-11 | In Progress | Preparing rc.1 final readiness and operator publish path. | T-0301 capsule docs updated. |
| 2026-06-11 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
