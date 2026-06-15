# T-0316 Stable 0.3.0 Approval-Gated Publish

## Metadata

| Field | Value |
|---|---|
| ID | T-0316 |
| Title | Stable 0.3.0 Approval-Gated Publish |
| Status | In Progress |
| Created | 2026-06-15 |
| Updated | 2026-06-15 |

## Goal

| Goal | Notes |
|---|---|
| Publish stable `hadara@0.3.0` through the manual approval-gated npm helper and record registry verification evidence. | T-0315 completed stable readiness without mutation; T-0316 owns the actual npm publish, optional GitHub Release draft, and post-publish evidence. |

## Scope

| In Scope | Reason |
|---|---|
| Stage package-facing release docs for post-publish npmjs rendering. | README is included in the npm package tarball, so it must read as the stable release immediately after publish. |
| Prepare operator instructions for `npm login` plus the manual helper `--execute` run. | The operator performs the credentialed registry mutation outside Codex. |
| Attach helper output and npm view verification evidence after operator execution. | T-0316 must prove the registry mutation and version visibility. |
| Close the capsule after publish evidence is recorded. | Keeps publish mutation evidence separate from T-0315 readiness evidence. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| New feature work or release hardening. | T-0315 already completed stable readiness; publish should not change runtime behavior. |
| Docker image, PyPI publish, installer execution, or MCP release execution. | These remain deferred release targets. |
| Recording npm credentials, tokens, private logs, or local machine state. | Public evidence must stay reduced and secret-free. |
| Post-publish installed-package recycle. | Follow-up T-0317 should validate the published stable package in consumer environments. |

## Status

In Progress

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-15 | In Progress | Capsule created for approval-gated stable npm publish and package-facing README staging. | T-0315 readiness complete; operator publish pending. |
<!-- hadara:managed:end task-status-history -->
