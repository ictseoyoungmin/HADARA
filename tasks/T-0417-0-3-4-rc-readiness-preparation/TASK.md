# T-0417 0.3.4 RC Readiness Preparation

## Metadata

| Field | Value |
|---|---|
| ID | T-0417 |
| Title | 0.3.4 RC Readiness Preparation |
| Status | In Progress |
| Created | 2026-06-25 |
| Updated | 2026-06-25 |

## Goal

| Goal | Notes |
|---|---|
| Prepare `hadara@0.3.4-rc.0` source/readiness without publish mutation. | Align package metadata, release docs, README package-facing guidance, readiness evidence, and handoff state for the next approval-gated publish capsule. |

## Scope

| In Scope | Reason |
|---|---|
| Set source/package metadata to `0.3.4-rc.0`. | The next candidate must be verifiable from built CLI/package surfaces before npm publish. |
| Update release notes/readiness and README package-facing status. | npm README is user-facing and must distinguish published stable `0.3.3` from source candidate `0.3.4-rc.0`. |
| Run source/readiness validation from the built CLI path. | Release readiness must be evidence-backed before publish mutation. |
| Keep publish mutation out of scope. | npm publish and GitHub Release remain approval-gated follow-up work. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| npm publish or dist-tag mutation. | Belongs to a dedicated approval-gated publish capsule. |
| GitHub Release creation. | Secondary target; not part of source readiness. |
| Docker/PyPI publish, installer execution, MCP release/package execution, token loading. | Out of scope for 0.3.4-rc.0 source readiness. |
| New product surfaces beyond UX hardening. | 0.3.4 is a dogfood-driven hardening line, not a new large feature line. |

## Status

In Progress

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| TBD | Draft | Initial task scaffold. | TBD |
| 2026-06-25 | In Progress | Preparing `hadara@0.3.4-rc.0` source/readiness after 0.3.4 agent UX hardening. | TBD |
<!-- hadara:managed:end task-status-history -->
