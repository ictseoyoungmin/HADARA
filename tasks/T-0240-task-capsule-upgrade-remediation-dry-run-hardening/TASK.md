# T-0240 Task Capsule Upgrade Remediation Dry Run Hardening

## Metadata

| Field | Value |
|---|---|
| ID | T-0240 |
| Title | Task Capsule Upgrade Remediation Dry Run Hardening |
| Status | Done |
| Created | 2026-06-04 |
| Updated | 2026-06-04 |

## Goal

| Goal | Notes |
|---|---|
| Harden dry-run-first Task Capsule upgrade/remediation writes. | `task upgrade-scaffold` and safe `protocol remediate` execute modes should prove the operator reviewed the current dry-run plan before writing. |

## Scope

| In Scope | Reason |
|---|---|
| Add report-level before-hash metadata to task scaffold upgrade and protocol remediation dry-runs. | Operators need a stable token that represents the planned bounded write set. |
| Require matching `--before-hash` for execute when planned writes exist. | Execute should not silently re-plan and write without tying back to a reviewed dry-run. |
| Update CLI guidance, schemas, focused tests, and workbench remediation next actions. | Consumers must know how to run the safe dry-run/execute pair. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Broad historical capsule migration. | This capsule hardens command safety; it does not migrate old tasks. |
| Adding new remediation fix types. | Existing fixes are enough to validate the execution contract. |
| Dashboard or TUI polish. | UI work is paused unless a concrete operator blocker appears. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-04 | Draft | Initial task scaffold. | hadara task create |
| 2026-06-04 | In Progress | Scope fixed to before-hash dry-run/execute guards for upgrade/remediation writes. | Capsule update |
| 2026-06-04 | Done | Dry-run before-hash guards implemented, documented, and validated. | Focused Docker tests, Docker sync-build, and built CLI guard smoke evidence. |
