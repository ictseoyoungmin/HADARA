# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `evidence add-command` can write explicit v2 `category` and `outcome` metadata without breaking legacy `result`. | Done | Docker focused suite passed; built CLI smoke `ev:T-0330:4faf84f9dd7a45e8b353d7d9` recorded `category: decision` and `outcome: recorded`. |
| AC-2 | `evidence add-command` can write explicit `resolves:<id>` and `supersedes:<id>` tags without relying on summary prose. | Done | Docker focused suite passed; evidence records include exact `resolves:` and `supersedes:` tags. |
| AC-3 | Evidence semantics prefer exact resolution markers and limit same-category fallback to legacy compatibility. | Done | Docker focused suite passed evidence semantics and lint coverage. |
| AC-4 | Operator docs and command metadata describe the new options and preserve no-execution/no-broad-migration boundaries. | Done | Docs, registry, generated init, and docs regression tests passed in Docker focused/full validation. |
| AC-5 | Validation evidence is attached through the evidence writer. | Done | Evidence ids `ev:T-0330:bbe12677ce5b4844ae6dfcde`, `ev:T-0330:e3a494f054a749089098ac64`, `ev:T-0330:89c60f19499f43e5a2616641`, and `ev:T-0330:4faf84f9dd7a45e8b353d7d9`. |
| AC-6 | Handoff and shared state docs are updated before close. | Done | T-0330 capsule docs, Development Slices, Project State, and Agent Handoff updated before finish/ready/close. |
