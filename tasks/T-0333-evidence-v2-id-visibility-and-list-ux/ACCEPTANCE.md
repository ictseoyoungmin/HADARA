# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Text `evidence list` output includes evidence id. | Done | Built CLI text smoke showed `[ev:T-0330:...]` rows. |
| AC-2 | Text `evidence list` output includes category/outcome. | Done | Built CLI text smoke showed `validation/passed`, `decision/recorded`, and audit outcomes. |
| AC-3 | JSON list output includes id, idSource, idStability, persistedSchemaVersion, category, outcome, and tags. | Done | Built CLI JSON smoke and focused tests passed. |
| AC-4 | Docs show list -> copy durable `ev:` id -> `evidence add-command --resolves <ev:id>`. | Done | README, workflow docs, CLI JSON contract, generated init docs, and registry metadata updated. |
| AC-5 | Docs do not use legacy ids in resolution examples. | Done | Resolution examples use durable `ev:` ids; legacy ids are described as inspection-only. |
| AC-6 | No `EVIDENCE.md` schema/frame rewrite occurs. | Done | Only the T-0333 evidence writer appended task evidence rows. |
| AC-7 | No rebuild command is implemented. | Done | No rebuild runtime surface added. |
| AC-8 | Focused and full validation pass. | Done | Docker focused 5 files / 64 tests; targeted 4 files / 46 tests; full sync-build 119 files / 791 tests. |
