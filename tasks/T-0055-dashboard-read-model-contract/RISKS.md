# Risks

| Risk | Mitigation |
|---|---|
| Contract work expands into UI implementation. | Keep T-0055 docs and read model only. |
| Dashboard misinterprets `ok` as operational health. | Add separate `health` semantics. |
| Raw and normalized status counts are ambiguous. | Preserve original labels under `rawStatusCounts` and normalized keys under `normalizedStatusCounts`. |
