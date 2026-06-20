# T-0402 0.3.3-rc.0 Approval-Gated Publish

## Metadata

| Field | Value |
|---|---|
| ID | T-0402 |
| Title | 0.3.3-rc.0 Approval-Gated Publish |
| Status | Done |
| Created | 2026-06-20 |
| Updated | 2026-06-20 |

## Goal

| Goal | Notes |
|---|---|
| Publish `hadara@0.3.3-rc.0` to npm with the `next` dist-tag through the approval-gated helper. | Requires operator npm authentication and explicit `publish` confirmation before mutation. |

## Scope

| In Scope | Reason |
|---|---|
| Run or hand off `scripts/release/manual-publish-rc.sh T-0402`. | Helper refreshes validation/artifacts and performs no publish without `--execute`. |
| Run `scripts/release/manual-publish-rc.sh T-0402 --execute` only after operator npm login and explicit confirmation. | Actual npm publish must be interactive and approval-gated. |
| Publish release candidate with npm dist-tag `next`. | RC must not replace stable `latest`. |
| Verify npm registry visibility for `hadara@0.3.3-rc.0`. | npm package versions are immutable; registry proof is required. |
| Verify dist-tags, package metadata, tarball/README visibility, and installed-package smoke as feasible. | Confirms publish usability before handoff to recycle. |
| Attach evidence and update shared state after publish. | Required before close. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Source/readiness changes for `0.3.3-rc.0`. | Completed in T-0401. |
| GitHub Release creation. | Optional only if explicitly requested via `--github-draft`; default is out of scope. |
| Stable `0.3.3` publish. | Requires rc recycle decision first. |
| Docker/PyPI publish. | Deferred release targets. |
| Installer execution. | Out of npm publish scope. |
| MCP release/package execution. | Out of npm publish scope. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-20 | Draft | Initial task scaffold. | `task create` |
| 2026-06-20 | In Progress | Publish-only capsule prepared; awaiting operator npm login and explicit helper execute. | T-0402 capsule docs |
| 2026-06-20 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
