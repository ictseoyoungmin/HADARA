# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `.hadara/docs-registry.json` exists in the source checkout. | Met | Added generated `hadara.docs.registry.v1` file with `projectProfile: "hadara-dev"`. |
| AC-2 | `docs/DOC_REGISTRY.md` exists as the human-readable projection. | Met | Added managed `doc-registry-summary` projection. |
| AC-3 | `.hadara/context/HADARA_CONTEXT.md` no longer routes to absent registry artifacts. | Met | Both routed files now exist. |
| AC-4 | `docs list` reads the committed registry rather than relying on inference. | Met | `docs list --json` reported `registryPresent:true` and `inferred:false`. |
| AC-5 | Docs registry validation surfaces are non-blocking. | Met | `docs doctor`, `docs required-reading`, `docs explain --path docs/PROJECT_STATE.md`, and `protocol doctor --scope docs` returned `ok:true`. |
| AC-6 | No broad self-migration execute is run. | Met | `protocol migrate --target 0.3.0` was dry-run only; execute remained out of scope. |
| AC-7 | Evidence is attached and handoff is updated. | Met | T-0313 evidence records appended; task/shared handoff updated before close. |
