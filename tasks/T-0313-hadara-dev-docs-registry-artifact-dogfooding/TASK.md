# T-0313 HADARA-dev Docs Registry Artifact Dogfooding

## Metadata

| Field | Value |
|---|---|
| ID | T-0313 |
| Title | HADARA-dev Docs Registry Artifact Dogfooding |
| Status | Done |
| Created | 2026-06-14 |
| Updated | 2026-06-14 |

## Goal

| Goal | Notes |
|---|---|
| Dogfood HADARA-dev docs registry artifacts by adding the committed registry files referenced by `.hadara/context/HADARA_CONTEXT.md`. | Fresh init and protocol migration already create these artifacts for consumer projects; HADARA-dev should not route agents to absent registry files. |

## Scope

| In Scope | Reason |
|---|---|
| Decide and apply the minimal HADARA-dev docs registry artifact policy. | The context anchor routes readers to `.hadara/docs-registry.json` and `docs/DOC_REGISTRY.md`. |
| Add `.hadara/docs-registry.json` and `docs/DOC_REGISTRY.md`. | Align source checkout artifacts with the 0.3 docs registry model. |
| Validate docs list, doctor, required-reading, explain, and protocol doctor surfaces. | Prove the committed artifact works instead of relying on inferred registry state. |
| Record broad migration as dry-run-only. | Avoid project-wide writes outside the focused artifact scope. |

## Out of Scope

| Out of Scope | Reason |
|---|---|
| Broad `protocol migrate --target 0.3.0 --execute` on HADARA-dev. | Dry-run still plans unrelated project-wide writes such as protocol marker, command surface, and SOP marker changes. |
| Rewriting `docs/PROJECT_STATE.md` history. | Useful cleanup, but not required to dogfood registry artifacts. |
| Changing docs registry schema or seed behavior. | This capsule adopts current artifacts; schema changes need separate design and tests. |
| Implementing `docs patch --execute` atomic write hardening. | This remains the next focused hardening capsule. |
| New npm publish, version bump, or GitHub Release. | This is source dogfooding only. |

## Status

Done

## Status History

<!-- hadara:managed:start task-status-history {"schema":"hadara.managedSection.v1","owner":"task.finish","kind":"markdown-table","mode":"update-row","version":1,"required":true,"closeSourceRole":"included"} -->
| Time | Status | Reason | Evidence |
|---|---|---|---|
| TBD | Draft | Initial task scaffold. | TBD |
| 2026-06-14 | Done | Finished task capsule. | `hadara task finish --execute` |
<!-- hadara:managed:end task-status-history -->
