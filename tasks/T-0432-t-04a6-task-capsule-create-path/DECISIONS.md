# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D-1 | Filter task templates to the 0.4 generated file set instead of deleting template metadata now. | Accepted | This keeps CLI compatibility while preventing `--from` from recreating legacy sidecar files. | `ev:T-0432:6e7934c04498493ba76eac8f` |
| D-2 | Keep legacy sidecar completion compatibility in validators for existing projects. | Accepted | New creates use four files, but existing tests/projects can still close sidecar-authored capsules until legacy boundary work is explicit. | `ev:T-0432:6e7934c04498493ba76eac8f` |
