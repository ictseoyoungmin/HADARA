# Decisions

| ID | Decision | Status | Rationale | Evidence |
|---|---|---|---|---|
| D1 | Store resolved relative import targets as project-relative paths in `CodeFileNode.imports`. | Accepted | This keeps file-level imports directly source-addressable and ready for code index edges. | `ev:T-0354:9093ae17f3c64a54b46b319c` |
| D2 | Emit `IMPORTS` edges only for resolved project files. | Accepted | External packages and unresolved relative imports do not have project file nodes yet. | `ev:T-0354:9093ae17f3c64a54b46b319c` |
| D3 | Keep exported names as file metadata only in this capsule. | Accepted | Symbol nodes and `EXPORTS` edges belong to the next C2 symbol extraction capsule. | `ev:T-0354:9093ae17f3c64a54b46b319c` |
