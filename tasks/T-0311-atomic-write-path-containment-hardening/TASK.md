# T-0311 Atomic Write Path Containment Hardening

## Metadata

| Field | Value |
|---|---|
| ID | T-0311 |
| Title | Atomic Write Path Containment Hardening |
| Status | Done |
| Created | 2026-06-12 |
| Updated | 2026-06-12 |

## Goal

| Goal | Notes |
|---|---|
| Harden shared atomic text writes so callers cannot escape the project root through `relativePath`. | Follow-up to T-0309 after the atomic helper became common infrastructure for migration and docs registry writes. |

## Scope

| In Scope | Reason |
|---|---|
| Add project-root containment validation to `prepareAtomicTextFileWrite()` / `atomicWriteTextFile()`. | The helper is shared by write paths that should remain project-bound. |
| Add regression coverage for traversal and absolute-path rejection. | Prevent future user-input call sites from weakening the boundary. |
| Renumber rc.2 post-publish recycle planning from T-0311 to T-0312. | T-0311 is now this focused hardening capsule; publish/recycle remains operator-gated. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| npm publish for `hadara@0.3.0-rc.2`. | Requires explicit operator approval and was already left out of T-0310. |
| Post-publish installed-package recycle. | Belongs after actual registry publication and is moved to T-0312. |
| Broad release readiness revalidation. | T-0310 already ran the full release readiness suite; this capsule needs focused hardening validation. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-12 | Draft | Initial task scaffold. | `hadara task create` |
| 2026-06-12 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
