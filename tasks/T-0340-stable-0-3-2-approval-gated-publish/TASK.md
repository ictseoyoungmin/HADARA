# T-0340 Stable 0.3.2 Approval-Gated Publish

## Metadata

| Field | Value |
|---|---|
| ID | T-0340 |
| Title | Stable 0.3.2 Approval-Gated Publish |
| Status | Blocked |
| Created | 2026-06-17 |
| Updated | 2026-06-17 |

## Goal

| Goal | Notes |
|---|---|
| Publish stable `hadara@0.3.2` through the approval-gated npm release flow after T-0339 selected stable publish. | Requires explicit operator approval/authentication before any npm publish mutation. |

## Scope

| In Scope | Reason |
|---|---|
| Prepare stable `0.3.2` publish execution from T-0336/T-0337/T-0338/T-0339 evidence. | T-0339 selected stable publish and created this capsule. |
| Run required pre-publish checks and approval-gated helper flow. | Stable release mutation must be evidence-backed and explicit. |
| Verify npm registry visibility and dist-tags after publish if executed. | Stable publish must prove `latest` points at `0.3.2`. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Publishing without explicit operator approval. | Release mutation policy requires approval and authentication. |
| GitHub Release creation unless explicitly requested. | Previous publish capsules skipped GitHub Release by default. |
| Docker image, PyPI, installer, or MCP release mutation. | Deferred release targets remain out of scope. |

## Status

Blocked

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-17T12:37:36Z | Draft | Created after T-0339 selected stable `0.3.2` publish. | T-0339 D-2 |
| 2026-06-17T13:05:00Z | In Progress | Started stable `0.3.2` source/readiness preparation; publish mutation remains approval-gated. | T-0340 PLAN |
| 2026-06-17T13:06:00Z | Blocked | Stable source/readiness updates and local validation are prepared, but release artifact and helper publish flow require a clean committed worktree plus explicit operator approval/authentication. | `ev:T-0340:d364684c5ab6459498683f5c` |
<!-- hadara:managed:end task-status-history -->
