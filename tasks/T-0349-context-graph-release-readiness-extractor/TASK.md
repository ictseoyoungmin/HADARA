# T-0349 Context Graph Release Readiness Extractor

## Metadata

| Field | Value |
|---|---|
| ID | T-0349 |
| Title | Context Graph Release Readiness Extractor |
| Status | Done |
| Created | 2026-06-18 |
| Updated | 2026-06-18 |

## Goal

| Goal | Notes |
|---|---|
| Implement release-readiness context graph extraction. | Extract `ReleaseCheck` nodes and explicit release-document relationships from `docs/RELEASE_READINESS.md` without mutating release state or executing release commands. |

## Scope

| In Scope | Reason |
|---|---|
| `docs/RELEASE_READINESS.md` heading-based `ReleaseCheck` nodes. | The C1 context graph spec names release readiness as a canonical source. |
| Explicit command references in release-readiness sections. | `CHECKS_COMMAND` edges should connect known command surfaces when the document explicitly names them. |
| Explicit evidence-id references in release-readiness sections. | `DEPENDS_ON_EVIDENCE` edges should preserve durable release evidence relationships when present. |
| Missing-source degradation. | Context graph extraction must remain advisory and non-throwing when optional sources are absent. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Running release gates, package smoke, clean-checkout smoke, artifact build, publish, or registry/network checks. | This capsule is a read-only graph extractor only. |
| Reworking existing release-readiness service/gate behavior. | The existing release services remain canonical for release validation; this task only projects graph context. |
| Full state projection or CLI graph assembly. | Those are the next C1 surfaces after extractor coverage is complete. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| 2026-06-18T09:33:02Z | Draft | Initial task scaffold. | task create output |
| 2026-06-18T09:33:02Z | In Progress | Started C1 release readiness extractor implementation. | PLAN.md |
| 2026-06-18 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
