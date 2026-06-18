# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Exported declarations create `CodeSymbolNode` records with kind, path, exported, and line metadata. | Done | `ev:T-0355:2ab6f20fb61b4b4e8701a037` |
| AC-2 | Export-list aliases create exported unknown-kind symbol records without failing. | Done | `ev:T-0355:2ab6f20fb61b4b4e8701a037` |
| AC-3 | Each symbol has deterministic `DEFINES_SYMBOL` and `EXPORTS` edges with source metadata. | Done | `ev:T-0355:2ab6f20fb61b4b4e8701a037` |
| AC-4 | `CodeIndexReport.summary.symbols` and `summary.edges` include symbol outputs. | Done | `ev:T-0355:2ab6f20fb61b4b4e8701a037` |
| AC-5 | Command hints, test relation edges, graph integration, public CLI, cache writes, and source mutation remain out of scope. | Done | `ev:T-0355:2ab6f20fb61b4b4e8701a037` |
| AC-6 | Focused/full Docker validation evidence is attached and shared docs point to command implementation/test hints next. | Done | `ev:T-0355:2ab6f20fb61b4b4e8701a037` |
