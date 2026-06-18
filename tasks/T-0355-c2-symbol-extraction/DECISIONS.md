# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D1 | Generate symbols only from exported declarations/list entries in this capsule. | Accepted | Initial C2 spec lists exported symbol extraction patterns; whole-program local symbol indexing is a non-goal. | `ev:T-0355:2ab6f20fb61b4b4e8701a037` |
| D2 | Use `unknown` kind for export-list aliases. | Accepted | Export lists may reference declarations in another file; resolving declaration kind is deeper semantic analysis. | `ev:T-0355:2ab6f20fb61b4b4e8701a037` |
| D3 | Emit both `DEFINES_SYMBOL` and `EXPORTS` edges for exported symbols. | Accepted | `DEFINES_SYMBOL` relates file-to-symbol, while `EXPORTS` carries public export intent. | `ev:T-0355:2ab6f20fb61b4b4e8701a037` |
