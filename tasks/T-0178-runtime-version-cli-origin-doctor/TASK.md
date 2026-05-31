# T-0178 Runtime Version CLI Origin Doctor

## Metadata

| Field | Value |
|---|---|
| ID | T-0178 |
| Title | Runtime Version CLI Origin Doctor |
| Status | Done |
| Created | 2026-05-31 |
| Updated | 2026-05-31 |

## Goal

| Goal | Notes |
|---|---|
| Add a runtime version / CLI origin report. | `hadara version --verbose --json` should reveal which CLI entrypoint, project root, Node version, package version, git head, and dist/source freshness the operator is using. |

## Scope

| In Scope | Reason |
|---|---|
| `hadara version --verbose --json` | Read-only runtime report for CLI origin and stale build detection. |
| Runtime schema and tests | Consumers need stable `hadara.runtime.version.v1` validation coverage. |
| Phase 3.5 docs registration | Record the operator workflow hardening track before Phase 4 UI work. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Automatic rebuild or dist mutation | This task diagnoses runtime origin only; T-0179 handles sync-build scripting. |
| Network, provider, MCP, or shell execution surfaces | Runtime report stays local/read-only except read-only git metadata inspection. |

## Status

Done

## Status History

| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-05-31 | Draft | Initial task scaffold. | Task creation output. |
| 2026-05-31 | Active | Started runtime origin doctor implementation. | This capsule. |
| 2026-05-31 | Done | Runtime version report implemented and validated. | T-0178 evidence records. |
