# T-0389 Context Pack Item Source Hash Fidelity

## Metadata

| Field | Value |
|---|---|
| ID | T-0389 |
| Title | Context Pack Item Source Hash Fidelity |
| Status | Done |
| Created | 2026-06-20 |
| Updated | 2026-06-20 |

## Goal

| Goal | Notes |
|---|---|
| Make context pack item `sourceHash` prefer current raw-sliceable file text when available. | Preserve graph source hash fallback for missing or non-sliceable paths. |

## Scope

| In Scope | Reason |
|---|---|
| `src/context/context-pack.ts` source hash selection. | Fix source-address fidelity observed while using 0.3.3 context routing against T-0388. |
| Focused context pack regression coverage. | Prove file-backed items no longer inherit only the docs-registry graph source hash. |
| JSON/spec/command docs alignment. | Clarify field semantics for consumers. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Registry extractor redesign. | Document nodes may still be sourced from registry metadata; context pack item fidelity is the narrow fix. |
| New context-routing feature surface. | This is hardening of an existing field only. |
| Cache write behavior. | Read commands remain read-only; no cache write path changes. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-20 | Draft | Initial task scaffold. | T-0389 |
| 2026-06-20 | In Progress | Source-hash fidelity hardening started after context-pack dogfood. | ev:T-0389:61eafa48eb174f6ea4051e36 |
| 2026-06-20 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
