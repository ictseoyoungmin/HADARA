# T-0406 0.3.3 stable approval-gated publish

## Metadata

| Field | Value |
|---|---|
| ID | T-0406 |
| Title | 0.3.3 stable approval-gated publish |
| Status | In Progress |
| Created | 2026-06-22 |
| Updated | 2026-06-22 |

## Goal

| Goal | Notes |
|---|---|
| Publish stable `hadara@0.3.3` to npm with the `latest` dist-tag through the approval-gated helper. | T-0405 readiness passed; this capsule stages the operator-authenticated publish mutation and post-publish registry verification. |

## Scope

| In Scope | Reason |
|---|---|
| Approval-gated npm publish | Operator logs into npm and runs the helper with explicit confirmation. |
| Registry verification | Verify `npm view hadara@0.3.3 version` and dist-tags after publish. |
| Package-facing docs | Keep README/Release Readiness phrased for npm readers after `0.3.3` is published. |
| Evidence and close | Record publish/verification evidence and close only after registry proof. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Source readiness implementation | Completed in T-0405. |
| GitHub Release draft | Optional and not requested by default. |
| Docker/PyPI publish, installer execution, MCP release/package execution | Separate explicit mutations, not part of stable npm publish. |

## Status

In Progress

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-22 | Draft | Initial task scaffold. | `hadara task create` |
| 2026-06-22 | In Progress | Staged stable `0.3.3` approval-gated publish capsule and package-facing docs. | T-0406 task docs |
<!-- hadara:managed:end task-status-history -->
