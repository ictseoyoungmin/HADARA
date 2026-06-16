# T-0327 0.3.1-rc.1 Approval-Gated Publish

## Metadata

| Field | Value |
|---|---|
| ID | T-0327 |
| Title | 0.3.1-rc.1 Approval-Gated Publish |
| Status | Done |
| Created | 2026-06-16 |
| Updated | 2026-06-16 |

## Goal

| Goal | Notes |
|---|---|
| Publish `hadara@0.3.1-rc.1` through the approval-gated manual helper after T-0326 closes. | Operator authenticates to npm outside the repo, runs the helper from a clean committed source state, confirms `publish`, and records registry verification evidence. |

## Scope

| In Scope | Reason |
|---|---|
| Run `bash scripts/release/prepare-publish-env.sh T-0327` if a clean container publish clone is needed. | Avoid mounted-workspace npm/build issues and stale global `hadara`. |
| Run `bash scripts/release/manual-publish-rc.sh T-0327 --execute` only after npm authentication and explicit operator confirmation. | This is the intentional registry mutation capsule. |
| Verify `npm view hadara@0.3.1-rc.1 version --registry=https://registry.npmjs.org` after publish. | Prove npm registry visibility before closing. |
| Update release readiness, Task Board, Project State, Agent Handoff, and handoff to T-0328. | Keep publish and post-publish recycle states separate. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Source version bump and release-readiness preparation. | Completed in T-0326. |
| Post-publish installed-package recycle. | Belongs to T-0328 after npm visibility. |
| GitHub Release draft unless explicitly requested. | npm publish is primary; GitHub Release remains optional and approval-gated. |
| Docker image, PyPI/TestPyPI publish, installer execution, MCP release/package execution, or token persistence. | Out of scope for npm rc publish. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-16 | Draft | Publish capsule pre-created so the helper can validate task/version alignment after T-0326. | T-0326 |
| 2026-06-16 | In Progress | npm publish completed and registry visibility was verified; close now waits for npm dist-tag correction because the RC was initially published as `latest`. | `command:T-0327:npm-publish`; `command:T-0327:registry-tarball-verify`; `command:T-0327:dist-tag-drift-observed` |
| 2026-06-16 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
