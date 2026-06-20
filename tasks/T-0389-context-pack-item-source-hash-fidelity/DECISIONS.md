# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Prefer current item file hash for raw-sliceable context pack items. | Accepted | `ContextPackItem.path` is what consumers may slice, so its hash should identify the current source text when available. | `ev:T-0389:61eafa48eb174f6ea4051e36` |
| D-2 | Fall back to graph node source hash when the item path cannot be read. | Accepted | Graph source still explains provenance for registry-derived, missing, or non-sliceable items without turning missing files into errors. | `ev:T-0389:61eafa48eb174f6ea4051e36` |
| D-3 | Keep registry extractor behavior unchanged. | Accepted | The narrow issue is pack item fidelity, not graph extraction provenance. | `ev:T-0389:7e68c43ca20f44409d090d95` |
