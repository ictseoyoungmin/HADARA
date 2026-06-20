# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | `hadara task close-repair-plan --task T-XXXX --json` exists, is read-only, and returns `hadara.task.closeRepairPlan.v1`. | Met | `ev:T-0394:a32fcb73ccde4179a56cc267` |
| AC-2 | Not-closed, closed-stale, closed-invalid, duplicate-close-proof, closed-valid, and CLI report behavior are covered by tests. | Met | `ev:T-0394:f0875b6093844de1ac01053e` |
| AC-3 | Schema, command registry, CLI JSON contract, command surface, workflow docs, and schema docs are updated. | Met | `ev:T-0394:8c47406cc61a4314bde168b0` |
| AC-4 | Full Docker sync-build and diff hygiene checks pass. | Met | `ev:T-0394:8c47406cc61a4314bde168b0`, `ev:T-0394:e22abfd41b9048a492203406` |
| AC-5 | Capsule and shared handoff/state docs are updated before finish/ready/close. | Met | This capsule handoff plus shared doc updates in the T-0394 diff. |
