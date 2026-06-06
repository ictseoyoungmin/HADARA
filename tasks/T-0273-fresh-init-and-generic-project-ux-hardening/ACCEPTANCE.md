# Acceptance Criteria

| ID | Criterion | Status | Evidence |
|---|---|---|---|
| AC-1 | Fresh `init --profile governed --json` emits structured JSON and `init doctor --json` has no `INIT_OLD_PROFILE_NAME` warning. | Done | Evidence `ev:T-0273:ba272d0e35eb459e90d167d4` and `ev:T-0273:599f3c4dcf8040388a41b45f`. |
| AC-2 | Fresh status/TUI phase extraction reads table-first `Phase` rows. | Done | Evidence `ev:T-0273:ba272d0e35eb459e90d167d4` and `ev:T-0273:599f3c4dcf8040388a41b45f`. |
| AC-3 | `handoff update --json` emits a structured write report. | Done | Evidence `ev:T-0273:ba272d0e35eb459e90d167d4` and `ev:T-0273:599f3c4dcf8040388a41b45f`. |
| AC-4 | `handoff suggest --json` uses generic project wording without HADARA-dev Phase 6 copy. | Done | Evidence `ev:T-0273:ba272d0e35eb459e90d167d4` and `ev:T-0273:599f3c4dcf8040388a41b45f`. |
| AC-5 | `doctor --json` reports `.hadara/context/HADARA_CONTEXT.md` for project context. | Done | Evidence `ev:T-0273:ba272d0e35eb459e90d167d4` and `ev:T-0273:599f3c4dcf8040388a41b45f`. |
| AC-6 | Evidence is attached and handoff/state docs are updated. | Done | `docs/PROJECT_STATE.md`, `docs/AGENT_HANDOFF.md`, and `docs/DEVELOPMENT_SLICES.md` updated. |
