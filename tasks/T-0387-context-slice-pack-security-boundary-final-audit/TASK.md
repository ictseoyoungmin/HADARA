# T-0387 Context Slice/Pack Security Boundary Final Audit

## Metadata

| Field | Value |
|---|---|
| ID | T-0387 |
| Title | Context Slice/Pack Security Boundary Final Audit |
| Status | Done |
| Created | 2026-06-19 |
| Updated | 2026-06-19 |

## Goal

| Goal | Notes |
|---|---|
| Ensure context pack does not advertise raw slice candidates outside the context-slice security boundary. | Share the raw slice path boundary predicate between `context slice` and `context pack`, preserve the existing public `.hadara` allowlist, and validate with focused boundary tests plus full Docker sync-build. |

## Scope

| In Scope | Reason |
|---|---|
| Add a shared context-slice path boundary helper. | Prevent denylist/allowlist drift between runtime surfaces. |
| Use the shared boundary in `context slice`. | Preserve current raw read behavior while centralizing the predicate. |
| Filter `context pack` slice candidates through the same boundary. | Avoid publishing suggested slice commands that the raw slice adapter would later reject. |
| Add regression coverage and record validation evidence. | Boundary changes are security-sensitive and need proof. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Add new permission flags such as `--allow-local-cache`. | Not needed for 0.3.3 and would widen raw read surface. |
| Change the current public `.hadara` allowlist. | The audit preserves `.hadara/context/HADARA_CONTEXT.md` and `.hadara/docs-registry.json` as intentional public-context reads. |
| Add pack-specific persisted shards or new cache writes. | This capsule is boundary hardening only. |
| Rewrite the security model. | The existing security docs remain authoritative; this task aligns implementation surfaces. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-19 | Draft | Initial task scaffold. | TBD |
| 2026-06-19 | In Progress | Boundary helper, pack filtering, tests, and validation evidence are prepared for finish. | `ev:T-0387:561d66c217184e529964d5ee` |
| 2026-06-19 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
