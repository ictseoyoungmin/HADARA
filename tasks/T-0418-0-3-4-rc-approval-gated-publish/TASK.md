# T-0418 0.3.4 RC Approval-Gated Publish

## Metadata

| Field | Value |
|---|---|
| ID | T-0418 |
| Title | 0.3.4 RC Approval-Gated Publish |
| Status | In Progress |
| Created | 2026-06-25 |
| Updated | 2026-06-25 |

## Goal

| Goal | Notes |
|---|---|
| Publish `hadara@0.3.4-rc.0` to npm with dist-tag `next` after T-0417 readiness. | Keep npm publish approval-gated and operator-authenticated; do not create a GitHub Release draft unless explicitly requested later. |

## Scope

| In Scope | Reason |
|---|---|
| Verify T-0417 readiness is current for `hadara@0.3.4-rc.0`. | Publish must only follow source/readiness proof. |
| Confirm npm registry state before publish. | The exact version must not already exist and `latest` must remain stable. |
| Prepare the ext4 publish clone/environment. | Publishing from mounted `/workspace` is unreliable for npm build tooling. |
| Record exact operator publish command and post-publish verification requirements. | The actual npm authentication/interactive publish step is operator-controlled. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Silent npm publish or token loading by the agent. | Publish must be explicit and operator-approved. |
| GitHub Release draft creation. | Secondary target; not requested for this RC publish unless a later approval explicitly asks for it. |
| Docker/PyPI publish, installer execution, MCP release/package execution. | Out of scope for npm RC publish. |
| Changing package source version or release notes scope. | T-0417 already prepared source/readiness for `0.3.4-rc.0`. |

## Status

In Progress

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| TBD | Draft | Initial task scaffold. | TBD |
| 2026-06-25 | In Progress | Preparing approval-gated npm publish for `hadara@0.3.4-rc.0` with dist-tag `next`. | TBD |
<!-- hadara:managed:end task-status-history -->
