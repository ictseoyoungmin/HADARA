# Findings

| ID | Finding | Severity | Status | Evidence |
|---|---|---|---|---|
| F-1 | Before T-0313, HADARA-dev routed readers to docs registry artifacts that were absent from the source checkout. | Medium | Fixed | `.hadara/docs-registry.json` and `docs/DOC_REGISTRY.md` now exist. |
| F-2 | Broad self-migration still plans project-wide writes unrelated to the registry artifact gap. | Medium | Carry forward as caution | `protocol migrate --target 0.3.0 --json` still planned protocol marker, command surface, and SOP marker writes; execute was not run. |
| F-3 | `docs/DOC_REGISTRY.md` is generated as a projection but not currently registered as a registry entry by the seed. | Low | Accepted | `docs explain --path docs/DOC_REGISTRY.md` reports `DOC_NOT_REGISTERED`; changing seed behavior is out of scope. |
