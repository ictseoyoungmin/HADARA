# Plan

| Step | Action | Status | Evidence |
|---|---|---|---|
| 1 | Read required project docs and T-0333 0.3.2 specs. | Done | AGENTS, context, state, handoff, board, SOP, workflow, slices, 0.3.2 design, worker instructions, and T-0333 capsule spec read. |
| 2 | Update evidence list JSON normalization/schema so id stability fields are explicit. | Done | `src/services/evidence-list.ts` and `src/schemas/evidence-list.schema.json` updated; focused/full tests passed. |
| 3 | Update text `evidence list` output to show `[id] time | category/outcome | visibility | summary`. | Done | Built CLI `evidence list --task T-0330` smoke passed. |
| 4 | Add minimal docs for durable `ev:` id resolution workflow and legacy id caution. | Done | README, CLI JSON contract, workflow docs, generated init docs, and command registry updated. |
| 5 | Run focused and full validation, then attach evidence. | Done | Docker focused 5 files / 64 tests; targeted rerun 4 files / 46 tests; full Docker sync-build 119 files / 791 tests; evidence records appended. |
| 6 | Update acceptance, tests, files, handoff, and shared state before finish/close. | Done | Capsule and shared docs updated before finish/ready/close. |
