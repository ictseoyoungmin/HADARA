# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Canonical 0.4 productization redesign documents from `manifest.json` are registered in `.hadara/docs-registry.json` without registering the removed nested package path. | Met | `ev:T-0427:8f087c4cf64747628829a5dc` |
| AC-2 | `docs/DOC_REGISTRY.md` projection includes the 0.4 entries and `docs doctor --scope registry` reports no registry errors. | Met | `ev:T-0427:8f087c4cf64747628829a5dc` |
| AC-3 | `docs/IMPLEMENTATION_SOP.md` conditionally routes agents to the 0.4 README and worker plan for 0.4 implementation work. | Met | `ev:T-0427:8f087c4cf64747628829a5dc` |
| AC-4 | Docker `hadara-dev` container is recreated and workspace built CLI version smoke passes. | Met | `ev:T-0427:8f087c4cf64747628829a5dc` |
| AC-5 | Evidence is attached and shared state/handoff point next to T-04A2. | Met | `ev:T-0427:7626c70c819e41afa2e084b8` |
