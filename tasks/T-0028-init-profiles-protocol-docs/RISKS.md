# Risks

| Risk | Mitigation |
|---|---|
| Init could overwrite user-authored docs. | Continue using `writeFileIfMissing()` so existing files are preserved. |
| Profiles could imply more behavior than exists. | Keep full/hadara-protocol scoped to protocol document scaffolding for now. |
